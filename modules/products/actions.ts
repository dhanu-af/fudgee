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
      // The generic FK-violation error doesn't say which relation blocked
      // it, which left this dead-ended for a non-technical user to resolve
      // ("used in existing orders, batches, or inventory records" — which
      // one?). Counting every relation Product actually has lets the
      // message name the exact records to go remove first.
      const [
        salesOrderLines,
        purchaseOrderLines,
        inventoryTransactions,
        productionBatches,
        batchInputUsages,
        recipe,
        recipeLineUsages,
        batchCalcLineUsages,
        packageItemUsages,
        images,
        reviews,
      ] = await Promise.all([
        db.salesOrderLine.count({ where: { productId: id } }),
        db.purchaseOrderLine.count({ where: { productId: id } }),
        db.inventoryTransaction.count({ where: { productId: id } }),
        db.productionBatch.count({ where: { productId: id } }),
        db.productionBatchInput.count({ where: { productId: id } }),
        db.recipe.findUnique({ where: { productId: id }, select: { id: true } }),
        db.recipeLine.count({ where: { productId: id } }),
        db.batchCalculationLine.count({ where: { productId: id } }),
        db.packageItem.count({ where: { productId: id } }),
        db.productImage.count({ where: { productId: id } }),
        db.review.count({ where: { productId: id } }),
      ]);

      const blockers = [
        salesOrderLines && `${salesOrderLines} sales order line(s)`,
        purchaseOrderLines && `${purchaseOrderLines} purchase order line(s)`,
        inventoryTransactions && `${inventoryTransactions} inventory transaction(s)`,
        productionBatches && `${productionBatches} production batch(es)`,
        batchInputUsages && `${batchInputUsages} batch input usage(s)`,
        recipe && "a recipe",
        recipeLineUsages && `${recipeLineUsages} recipe line(s) (used as an ingredient elsewhere)`,
        batchCalcLineUsages && `${batchCalcLineUsages} batch calculation line(s)`,
        packageItemUsages && `${packageItemUsages} package item(s)`,
        images && `${images} product photo(s)`,
        reviews && `${reviews} review(s)`,
      ].filter(Boolean);

      return {
        error:
          blockers.length > 0
            ? `Can't delete — still referenced by: ${blockers.join(", ")}. Remove those first, then delete the product.`
            : "Can't delete — this product is used in existing orders, batches, or inventory records.",
      };
    }
    return { error: "Failed to delete product." };
  }

  revalidatePath("/products");
  redirect("/products");
}
