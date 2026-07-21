import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getReturns } from "@/modules/shipping/queries";
import { ReturnTable } from "@/modules/shipping/components/return-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function ReturnsPage() {
  const session = await requirePermission(PERMISSIONS.SHIPPING_READ);
  const returns = await getReturns();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/returns" tabs={SHIPPING_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Returns</h1>
        {can(session, PERMISSIONS.SHIPPING_WRITE) && (
          <Button render={<Link href="/shipping/returns/new" />}>New return</Button>
        )}
      </div>
      <ReturnTable data={returns} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
    </div>
  );
}
