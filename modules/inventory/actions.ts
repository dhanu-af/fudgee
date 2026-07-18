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
