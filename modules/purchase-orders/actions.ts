"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { purchaseOrderSchema, purchaseOrderLineSchema } from "@/modules/purchase-orders/schema";

export type PurchaseOrderFormState = { error?: string };

export async function createPurchaseOrder(
  _prev: PurchaseOrderFormState,
  formData: FormData
): Promise<PurchaseOrderFormState> {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const parsed = purchaseOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let rawLines: unknown;
  try {
    rawLines = JSON.parse(parsed.data.linesJson);
  } catch {
    return { error: "Invalid line items." };
  }
  const linesParsed = z.array(purchaseOrderLineSchema).min(1, "At least one line item is required").safeParse(rawLines);
  if (!linesParsed.success) {
    return { error: linesParsed.error.issues[0]?.message ?? "Invalid line items." };
  }

  const lines = linesParsed.data.map((l) => ({ ...l, lineTotal: l.quantity * l.unitCost }));
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  await db.purchaseOrder.create({
    data: {
      supplierId: parsed.data.supplierId,
      expectedDate: parsed.data.expectedDate ? new Date(parsed.data.expectedDate) : undefined,
      notes: parsed.data.notes || undefined,
      subtotal,
      total: subtotal,
      lines: { create: lines },
    },
  });

  revalidatePath("/purchase-orders");
  redirect("/purchase-orders");
}

export type PurchaseOrderActionState = { error?: string };

export async function markPurchaseOrderSent(
  id: string,
  _prev: PurchaseOrderActionState,
  _formData: FormData
): Promise<PurchaseOrderActionState> {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const po = await db.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
  if (!po) return { error: "Purchase order not found." };
  // Without this, a stale page (e.g. a second tab still showing DRAFT after
  // the order was already received/cancelled elsewhere) could regress an
  // already-RECEIVED or CANCELLED order's status back to SENT.
  if (po.status !== "DRAFT") {
    return { error: "Only a draft purchase order can be marked as sent." };
  }

  await db.purchaseOrder.update({ where: { id }, data: { status: "SENT" } });
  revalidatePath(`/purchase-orders/${id}`);
  return {};
}

export async function markPurchaseOrderReceived(
  id: string,
  _prev: PurchaseOrderActionState,
  _formData: FormData
): Promise<PurchaseOrderActionState> {
  const session = await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const po = await db.purchaseOrder.findUnique({ where: { id }, include: { lines: true } });
  if (!po) return { error: "Purchase order not found." };
  // Without this, a double-click (or a resubmitted request after the page
  // hasn't yet refreshed to hide the button) would receipt the same PO's
  // stock twice — mirrors the status check createShipment already does.
  if (po.status !== "DRAFT" && po.status !== "SENT") {
    return { error: "This purchase order has already been received or cancelled." };
  }

  const location = await db.location.findFirst({ where: { isActive: true } });
  if (!location) {
    return { error: "Create a warehouse location before receiving purchase orders." };
  }

  await db.$transaction([
    db.purchaseOrder.update({ where: { id }, data: { status: "RECEIVED" } }),
    ...po.lines.map((line) =>
      db.inventoryTransaction.create({
        data: {
          productId: line.productId,
          locationId: location.id,
          type: "RECEIPT",
          quantity: line.quantity,
          referenceType: "PurchaseOrder",
          referenceId: id,
          createdByUserId: session.user.id,
        },
      })
    ),
  ]);

  revalidatePath(`/purchase-orders/${id}`);
  revalidatePath("/inventory");
  return {};
}

export async function cancelPurchaseOrder(
  id: string,
  _prev: PurchaseOrderActionState,
  _formData: FormData
): Promise<PurchaseOrderActionState> {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const po = await db.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
  if (!po) return { error: "Purchase order not found." };
  // Without this, a stale page could cancel an already-RECEIVED order —
  // the order would show CANCELLED while the stock it received (and the
  // InventoryTransaction rows tied to it) stay in place, silently
  // contradicting its own status.
  if (po.status !== "DRAFT" && po.status !== "SENT") {
    return { error: "This purchase order has already been received or cancelled." };
  }

  await db.purchaseOrder.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath(`/purchase-orders/${id}`);
  return {};
}

export async function deletePurchaseOrder(
  id: string,
  _prev: PurchaseOrderActionState,
  _formData: FormData
): Promise<PurchaseOrderActionState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    // markPurchaseOrderReceived() creates InventoryTransaction rows tagged
    // referenceType: "PurchaseOrder" — there's no DB-level FK/cascade for
    // that loose reference (see deleteInventoryTransaction's guard), so
    // without this explicit cleanup those rows would survive the PO,
    // permanently stuck ("Can't delete — created by a PurchaseOrder") and
    // leaving stock counts reflecting a PO that no longer exists. Same bug
    // class as deleteProductionBatch, fixed the same way.
    await db.$transaction([
      db.inventoryTransaction.deleteMany({ where: { referenceType: "PurchaseOrder", referenceId: id } }),
      db.purchaseOrder.delete({ where: { id } }),
    ]);
  } catch {
    return { error: "Failed to delete purchase order." };
  }

  revalidatePath("/purchase-orders");
  revalidatePath("/inventory");
  redirect("/purchase-orders");
}
