import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getAssetsWithBookValue } from "@/modules/finance/queries";
import { AssetTable } from "@/modules/finance/components/asset-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function AssetsPage() {
  const session = await requirePermission(PERMISSIONS.FINANCE_READ);
  const assets = await getAssetsWithBookValue();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/assets" tabs={FINANCE_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assets &amp; Depreciation</h1>
        {can(session, PERMISSIONS.FINANCE_WRITE) && (
          <Button render={<Link href="/finance/assets/new" />}>New asset</Button>
        )}
      </div>
      <AssetTable data={assets} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
    </div>
  );
}
