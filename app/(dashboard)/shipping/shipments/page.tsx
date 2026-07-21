import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getShipments } from "@/modules/shipping/queries";
import { ShipmentsTable } from "@/modules/shipping/components/shipments-table";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function ShipmentsPage() {
  await requirePermission(PERMISSIONS.SHIPPING_READ);
  const shipments = await getShipments();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/shipments" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Shipments</h1>
      <ShipmentsTable data={shipments} />
    </div>
  );
}
