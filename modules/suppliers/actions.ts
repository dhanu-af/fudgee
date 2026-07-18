"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { supplierSchema } from "@/modules/suppliers/schema";

export type SupplierFormState = { error?: string };

export async function createSupplier(_prev: SupplierFormState, formData: FormData): Promise<SupplierFormState> {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.supplier.create({ data: parsed.data });
  } catch {
    return { error: "A supplier with that code already exists." };
  }

  revalidatePath("/purchase-orders/suppliers");
  redirect("/purchase-orders/suppliers");
}

export async function updateSupplier(
  id: string,
  _prev: SupplierFormState,
  formData: FormData
): Promise<SupplierFormState> {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.supplier.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A supplier with that code already exists." };
  }

  revalidatePath("/purchase-orders/suppliers");
  redirect("/purchase-orders/suppliers");
}
