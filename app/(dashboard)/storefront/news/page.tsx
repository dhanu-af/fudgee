import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getNewsItems } from "@/modules/storefront/queries";
import { newsItemColumns } from "@/modules/storefront/components/news-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontNewsPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const newsItems = await getNewsItems();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/news" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">News & Milestones</h1>
        <Button render={<Link href="/storefront/news/new" />}>New announcement</Button>
      </div>
      <DataTable columns={newsItemColumns} data={newsItems} emptyMessage="No announcements yet." />
    </div>
  );
}
