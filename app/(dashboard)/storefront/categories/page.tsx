import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCategories } from "@/modules/storefront/queries";
import { categoryColumns } from "@/modules/storefront/components/category-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontCategoriesPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/categories" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button render={<Link href="/storefront/categories/new" />}>New category</Button>
      </div>
      <DataTable columns={categoryColumns} data={categories} emptyMessage="No categories yet." />
    </div>
  );
}
