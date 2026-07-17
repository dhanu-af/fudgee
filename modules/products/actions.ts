"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { productSchema } from "@/modules/products/schema";

export type ProductFormState = { error?: string };

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.product.create({ data: parsed.data });
  } catch {
    return { error: "A product with that SKU already exists." };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.product.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A product with that SKU already exists." };
  }

  revalidatePath("/products");
  redirect("/products");
}
