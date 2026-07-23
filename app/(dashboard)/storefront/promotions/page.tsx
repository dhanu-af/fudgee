import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getPromotions } from "@/modules/storefront/queries";
import { promotionColumns } from "@/modules/storefront/components/promotion-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontPromotionsPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const promotions = await getPromotions();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/promotions" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Promotions</h1>
        <Button render={<Link href="/storefront/promotions/new" />}>New promotion</Button>
      </div>
      <DataTable columns={promotionColumns} data={promotions} emptyMessage="No promotions yet." />
    </div>
  );
}
