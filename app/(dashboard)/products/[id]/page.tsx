import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getProductById } from "@/modules/products/queries";
import { updateProduct, deleteProduct } from "@/modules/products/actions";
import { ProductForm } from "@/modules/products/components/product-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { getCategories } from "@/modules/storefront/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit product</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteProduct.bind(null, id)}
            confirmMessage={`Delete "${product.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <ProductForm action={updateProduct.bind(null, id)} product={product} categories={categories} />
    </div>
  );
}
