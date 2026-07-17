import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getProducts } from "@/modules/products/queries";
import { productColumns } from "@/modules/products/components/product-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
  const session = await requirePermission(PERMISSIONS.PRODUCTS_READ);
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        {can(session, PERMISSIONS.PRODUCTS_WRITE) && (
          <Button render={<Link href="/products/new" />}>New product</Button>
        )}
      </div>
      <DataTable columns={productColumns} data={products} emptyMessage="No products yet." />
    </div>
  );
}
