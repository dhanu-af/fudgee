"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  createShipmentSchema,
  packageSchema,
  packageItemSchema,
  dispatchSchema,
  trackingEventSchema,
  carrierSchema,
  returnSchema,
  returnStatusSchema,
} from "@/modules/shipping/schema";

export type ShippingFormState = { error?: string };

// --- Shipment lifecycle ---

export async function createShipment(
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = createShipmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const so = await db.salesOrder.findUnique({
    where: { id: parsed.data.salesOrderId },
    include: { customer: true, lines: true },
  });
  if (!so) return { error: "Sales order not found." };
  if (so.status !== "CONFIRMED") return { error: "Only confirmed orders can be shipped." };

  const shipment = await db.shipment.create({
    data: {
      salesOrderId: so.id,
      deliveryAddress: so.customer.shippingAddress,
      items: { create: so.lines.map((line) => ({ salesOrderLineId: line.id, quantity: line.quantity })) },
    },
  });

  revalidatePath("/shipping/ready-to-ship");
  revalidatePath("/shipping/shipments");
  redirect(`/shipping/shipments/${shipment.id}`);
}

export async function reserveStock(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);
  await db.shipment.update({ where: { id }, data: { stockReserved: true } });
  revalidatePath(`/shipping/shipments/${id}`);
  revalidatePath("/shipping/ready-to-ship");
  return {};
}

type PickPackStatus = "WAITING" | "PICKING" | "PACKING" | "PACKED" | "READY_TO_DISPATCH";

export async function setShipmentStatus(
  id: string,
  status: PickPackStatus,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);
  await db.shipment.update({ where: { id }, data: { status } });
  revalidatePath(`/shipping/shipments/${id}`);
  revalidatePath("/shipping/pick-pack");
  revalidatePath("/shipping/dispatch");
  revalidatePath("/shipping/shipments");
  return {};
}

// Inventory is deducted here, at dispatch — not when the sales order was
// confirmed. Stock is only actually gone once it physically leaves.
export async function dispatchShipment(
  id: string,
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  const session = await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = dispatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const shipment = await db.shipment.findUnique({
    where: { id },
    include: { items: { include: { salesOrderLine: true } } },
  });
  if (!shipment) return { error: "Shipment not found." };

  const location = await db.location.findFirst({ where: { isActive: true } });
  if (!location) return { error: "Create a warehouse location before dispatching shipments." };

  await db.$transaction([
    db.shipment.update({
      where: { id },
      data: {
        status: "DISPATCHED",
        dispatchedAt: new Date(),
        dispatchedByUserId: session.user.id,
        carrierId: parsed.data.carrierId,
        trackingNumber: parsed.data.trackingNumber,
        freightCost: parsed.data.freightCost,
        driverName: parsed.data.driverName,
        vehicleInfo: parsed.data.vehicleInfo,
        numberOfCartons: parsed.data.numberOfCartons,
        signedBy: parsed.data.signedBy,
        dispatchNotes: parsed.data.dispatchNotes,
        shipDate: new Date(),
      },
    }),
    db.salesOrder.update({ where: { id: shipment.salesOrderId }, data: { status: "DISPATCHED" } }),
    ...shipment.items.map((item) =>
      db.inventoryTransaction.create({
        data: {
          productId: item.salesOrderLine.productId,
          locationId: location.id,
          type: "ISSUE",
          quantity: -item.quantity,
          referenceType: "Shipment",
          referenceId: id,
          createdByUserId: session.user.id,
        },
      })
    ),
    db.trackingEvent.create({
      data: { shipmentId: id, status: "Dispatched", note: "Dispatched from warehouse" },
    }),
  ]);

  revalidatePath(`/shipping/shipments/${id}`);
  revalidatePath("/shipping/dispatch");
  revalidatePath("/shipping/shipments");
  revalidatePath(`/sales-orders/${shipment.salesOrderId}`);
  revalidatePath("/inventory");
  return {};
}

// --- Packages ---

export async function addPackage(
  shipmentId: string,
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = packageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let rawItems: unknown;
  try {
    rawItems = JSON.parse(parsed.data.itemsJson);
  } catch {
    return { error: "Invalid package items." };
  }
  const itemsParsed = z.array(packageItemSchema).min(1, "Add at least one item").safeParse(rawItems);
  if (!itemsParsed.success) {
    return { error: itemsParsed.error.issues[0]?.message ?? "Invalid package items." };
  }

  await db.package.create({
    data: {
      shipmentId,
      boxType: parsed.data.boxType,
      weight: parsed.data.weight,
      lengthCm: parsed.data.lengthCm,
      widthCm: parsed.data.widthCm,
      heightCm: parsed.data.heightCm,
      photoUrl: parsed.data.photoUrl,
      items: { create: itemsParsed.data },
    },
  });

  revalidatePath(`/shipping/shipments/${shipmentId}`);
  return {};
}

export async function deletePackage(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const pkg = await db.package.findUnique({ where: { id }, select: { shipmentId: true } });
  try {
    await db.package.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete package." };
  }

  if (pkg) revalidatePath(`/shipping/shipments/${pkg.shipmentId}`);
  return {};
}

// Deleting a shipment does not reverse any inventory already deducted at
// dispatch, or touch the sales order's status — same simplification as
// deleteSalesOrder not reversing its own fulfillment side effects.
export async function deleteShipment(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.shipment.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete shipment." };
  }

  revalidatePath("/shipping/shipments");
  revalidatePath("/shipping/pick-pack");
  revalidatePath("/shipping/dispatch");
  revalidatePath("/shipping/tracking");
  revalidatePath("/shipping/ready-to-ship");
  return {};
}

// --- Tracking ---

// Statuses that also cascade onto the Shipment's own status, and (for
// DELIVERED) onto the Sales Order — everything else is just a logged
// milestone with no state change.
const TRACKING_STATUS_CASCADE: Record<string, "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED"> = {
  "In Transit": "IN_TRANSIT",
  "Out for Delivery": "OUT_FOR_DELIVERY",
  Delivered: "DELIVERED",
  Returned: "RETURNED",
};

export async function addTrackingEvent(
  shipmentId: string,
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = trackingEventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const cascadeStatus = TRACKING_STATUS_CASCADE[parsed.data.status];
  const shipment = cascadeStatus
    ? await db.shipment.findUnique({ where: { id: shipmentId }, select: { salesOrderId: true } })
    : null;

  await db.$transaction([
    db.trackingEvent.create({
      data: { shipmentId, status: parsed.data.status, location: parsed.data.location, note: parsed.data.note },
    }),
    ...(cascadeStatus ? [db.shipment.update({ where: { id: shipmentId }, data: { status: cascadeStatus } })] : []),
    ...(cascadeStatus === "DELIVERED" && shipment
      ? [db.salesOrder.update({ where: { id: shipment.salesOrderId }, data: { status: "DELIVERED" } })]
      : []),
  ]);

  revalidatePath(`/shipping/shipments/${shipmentId}`);
  revalidatePath("/shipping/tracking");
  revalidatePath("/shipping/shipments");
  return {};
}

export async function deleteTrackingEvent(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const event = await db.trackingEvent.findUnique({ where: { id }, select: { shipmentId: true } });
  try {
    await db.trackingEvent.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete tracking update." };
  }

  if (event) revalidatePath(`/shipping/shipments/${event.shipmentId}`);
  revalidatePath("/shipping/tracking");
  return {};
}

// --- Carriers ---

export async function createCarrier(
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = carrierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.carrier.create({ data: parsed.data });
  revalidatePath("/shipping/carriers");
  redirect("/shipping/carriers");
}

export async function updateCarrier(
  id: string,
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = carrierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.carrier.update({ where: { id }, data: parsed.data });
  revalidatePath("/shipping/carriers");
  redirect("/shipping/carriers");
}

export async function deleteCarrier(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.carrier.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete — this carrier may be used on an existing shipment." };
  }

  revalidatePath("/shipping/carriers");
  return {};
}

// --- Returns ---

export async function createReturn(
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = returnSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.return.create({
    data: {
      customerId: parsed.data.customerId,
      shipmentId: parsed.data.shipmentId,
      reason: parsed.data.reason,
      quantity: parsed.data.quantity,
      inspectionNotes: parsed.data.inspectionNotes,
      refundAmount: parsed.data.refundAmount,
    },
  });

  revalidatePath("/shipping/returns");
  redirect("/shipping/returns");
}

export async function updateReturnStatus(
  id: string,
  _prev: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  const parsed = returnStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid status." };
  }

  await db.return.update({ where: { id }, data: { status: parsed.data.status } });
  revalidatePath("/shipping/returns");
  return {};
}

export async function deleteReturn(
  id: string,
  _prev: ShippingFormState,
  _formData: FormData
): Promise<ShippingFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.return.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete return." };
  }

  revalidatePath("/shipping/returns");
  return {};
}
