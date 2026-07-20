import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createProduct } from "@/modules/products/actions";
import { ProductForm } from "@/modules/products/components/product-form";
import { getCategories } from "@/modules/storefront/queries";

export default async function NewProductPage() {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New product</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
