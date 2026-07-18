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

export async function deleteProduct(
  id: string,
  _prev: ProductFormState,
  _formData: FormData
): Promise<ProductFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.product.delete({ where: { id } });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2003") {
      return { error: "Can't delete — this product is used in existing orders, batches, or inventory records." };
    }
    return { error: "Failed to delete product." };
  }

  revalidatePath("/products");
  redirect("/products");
}
