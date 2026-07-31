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

export async function deleteInventoryTransaction(
  id: string,
  _prev: TransactionActionState,
  _formData: FormData
): Promise<TransactionActionState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const transaction = await db.inventoryTransaction.findUnique({ where: { id } });
  if (!transaction) return { error: "Transaction not found." };
  // referenceType/referenceId are set only on entries created automatically
  // by receiving a Purchase Order, completing a Production Batch, or
  // dispatching a Shipment — deleting one of those independently would leave
  // stock inconsistent with that source record's own history, with no way
  // to reverse it there. Only manual adjustments (createAdjustment, no
  // reference) are safe to delete outright.
  if (transaction.referenceType) {
    return {
      error: `Can't delete — this entry was created by a ${transaction.referenceType}, not a manual adjustment.`,
    };
  }

  try {
    await db.inventoryTransaction.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete transaction." };
  }

  revalidatePath("/inventory");
  return {};
}
