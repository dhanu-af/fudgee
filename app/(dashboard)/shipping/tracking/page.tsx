import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getTrackingList } from "@/modules/shipping/queries";
import { ShipmentsTable } from "@/modules/shipping/components/shipments-table";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function TrackingPage() {
  const session = await requirePermission(PERMISSIONS.SHIPPING_READ);
  const shipments = await getTrackingList();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/tracking" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Tracking</h1>
      <ShipmentsTable
        data={shipments}
        canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)}
        emptyMessage="No shipments in transit yet."
      />
    </div>
  );
}
