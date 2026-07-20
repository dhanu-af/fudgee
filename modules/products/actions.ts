"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { productSchema } from "@/modules/products/schema";
import { productImageSchema } from "@/modules/storefront/schema";

export type ProductFormState = { error?: string };
export type ProductImageFormState = { error?: string };

function productFormObject(formData: FormData) {
  return {
    ...Object.fromEntries(formData),
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
  };
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = productSchema.safeParse(productFormObject(formData));
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

  const parsed = productSchema.safeParse(productFormObject(formData));
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

// --- Product gallery photos (beyond the single primary imageUrl) ---
// Adding/removing a gallery photo is an edit to the product's own record,
// not a destructive action, so this stays on PRODUCTS_WRITE rather than
// requiring SYSTEM_DELETE the way deleting the product itself does.

export async function addProductImage(
  productId: string,
  _prev: ProductImageFormState,
  formData: FormData
): Promise<ProductImageFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = productImageSchema.safeParse({
    productId,
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.productImage.create({ data: parsed.data });

  revalidatePath(`/products/${productId}`);
  revalidatePath(`/shop/${productId}`);
  return {};
}

export async function deleteProductImage(
  id: string,
  productId: string,
  _prev: ProductImageFormState,
  _formData: FormData
): Promise<ProductImageFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  await db.productImage.delete({ where: { id } }).catch(() => null);

  revalidatePath(`/products/${productId}`);
  revalidatePath(`/shop/${productId}`);
  return {};
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
