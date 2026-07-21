import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getReadyToShipOrders } from "@/modules/shipping/queries";
import { ReadyToShipTable } from "@/modules/shipping/components/ready-to-ship-table";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function ReadyToShipPage() {
  await requirePermission(PERMISSIONS.SHIPPING_READ);
  const orders = await getReadyToShipOrders();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/ready-to-ship" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Ready to Ship</h1>
      <ReadyToShipTable data={orders} />
    </div>
  );
}
