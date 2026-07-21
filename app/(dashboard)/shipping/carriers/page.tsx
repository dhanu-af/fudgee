import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCarriers } from "@/modules/shipping/queries";
import { CarrierTable } from "@/modules/shipping/components/carrier-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function CarriersPage() {
  const session = await requirePermission(PERMISSIONS.SHIPPING_READ);
  const carriers = await getCarriers();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/carriers" tabs={SHIPPING_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Carriers</h1>
        {can(session, PERMISSIONS.SHIPPING_WRITE) && (
          <Button render={<Link href="/shipping/carriers/new" />}>New carrier</Button>
        )}
      </div>
      <CarrierTable data={carriers} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
    </div>
  );
}
