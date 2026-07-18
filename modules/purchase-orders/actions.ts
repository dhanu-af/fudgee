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
    await db.purchaseOrder.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete purchase order." };
  }

  revalidatePath("/purchase-orders");
  redirect("/purchase-orders");
}
