"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { adjustmentSchema } from "@/modules/inventory/schema";

export type AdjustmentFormState = { error?: string };

export async function createAdjustment(
  _prev: AdjustmentFormState,
  formData: FormData
): Promise<AdjustmentFormState> {
  const session = await requirePermission(PERMISSIONS.INVENTORY_WRITE);

  const parsed = adjustmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { productId, locationId, direction, quantity, note } = parsed.data;
  const signedQuantity = direction === "INCREASE" ? quantity : -quantity;

  await db.inventoryTransaction.create({
    data: {
      productId,
      locationId,
      type: "ADJUSTMENT",
      quantity: signedQuantity,
      note: note || undefined,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export type TransactionActionState = { error?: string };

// Whether the record a transaction's referenceType/referenceId points at is
// still around — used by deleteInventoryTransaction below to tell a live
// reference (blocked) from an orphan (safe to remove) apart.
const REFERENCE_EXISTS_CHECK: Record<string, (id: string) => Promise<boolean>> = {
  ProductionBatch: async (id) => (await db.productionBatch.count({ where: { id } })) > 0,
  PurchaseOrder: async (id) => (await db.purchaseOrder.count({ where: { id } })) > 0,
  Shipment: async (id) => (await db.shipment.count({ where: { id } })) > 0,
  SalesOrder: async (id) => (await db.salesOrder.count({ where: { id } })) > 0,
};

export async function deleteInventoryTransaction(
  id: string,
  _prev: TransactionActionState,
  _formData: FormData
): Promise<TransactionActionState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const transaction = await db.inventoryTransaction.findUnique({ where: { id } });
  if (!transaction) return { error: "Transaction not found." };
  // referenceType/referenceId are set only on entries created automatically
  // by receiving a Purchase Order, completing a Production Batch, dispatching
  // a Shipment, or fulfilling a Sales Order — deleting one of those while its
  // source record still exists would leave stock inconsistent with that
  // record's own history, with no way to reverse it there. But if the source
  // record itself has since been deleted (e.g. a since-removed Production
  // Batch, or an older one deleted before deleteProductionBatch was fixed to
  // clean up after itself), there's nothing left to stay consistent with —
  // blocking forever would just leave permanently-stuck junk rows.
  if (transaction.referenceType) {
    const stillExists = transaction.referenceId
      ? await REFERENCE_EXISTS_CHECK[transaction.referenceType]?.(transaction.referenceId)
      : false;
    if (stillExists) {
      return {
        error: `Can't delete — this entry was created by a ${transaction.referenceType}, not a manual adjustment. Delete/cancel that ${transaction.referenceType} instead.`,
      };
    }
  }

  try {
    await db.inventoryTransaction.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete transaction." };
  }

  revalidatePath("/inventory");
  return {};
}

export type BulkDeleteState = { error?: string; message?: string };

// Bulk version of the orphan check above: removes every transaction whose
// referenceType is set but the record it points at is gone, in one pass.
// Deliberately narrow — never touches a manual adjustment (no referenceType)
// or a transaction whose source record still exists, so it can't silently
// change stock math for anything still live.
export async function deleteAllStuckInventoryTransactions(
  _prev: BulkDeleteState,
  _formData: FormData
): Promise<BulkDeleteState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const candidates = await db.inventoryTransaction.findMany({
    where: { referenceType: { not: null } },
    select: { id: true, referenceType: true, referenceId: true },
  });

  const idsToDelete: string[] = [];
  for (const t of candidates) {
    const check = t.referenceType ? REFERENCE_EXISTS_CHECK[t.referenceType] : undefined;
    const stillExists = t.referenceId && check ? await check(t.referenceId) : false;
    if (!stillExists) idsToDelete.push(t.id);
  }

  if (idsToDelete.length === 0) {
    return { message: "Nothing to clean up — every entry is either a manual adjustment or still tied to a live record." };
  }

  await db.inventoryTransaction.deleteMany({ where: { id: { in: idsToDelete } } });

  revalidatePath("/inventory");
  return { message: `Removed ${idsToDelete.length} stuck ${idsToDelete.length === 1 ? "entry" : "entries"}.` };
}
