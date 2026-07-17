import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getProductById } from "@/modules/products/queries";
import { updateProduct } from "@/modules/products/actions";
import { ProductForm } from "@/modules/products/components/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit product</h1>
      <ProductForm action={updateProduct.bind(null, id)} product={product} />
    </div>
  );
}
