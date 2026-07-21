import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getPickPackQueue } from "@/modules/shipping/queries";
import { ShipmentsTable } from "@/modules/shipping/components/shipments-table";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function PickPackPage() {
  await requirePermission(PERMISSIONS.SHIPPING_READ);
  const shipments = await getPickPackQueue();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/pick-pack" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Pick & Pack</h1>
      <p className="text-sm text-muted-foreground">
        Open a shipment to work through picking, packing, and boxing — status updates happen on its detail page.
      </p>
      <ShipmentsTable data={shipments} emptyMessage="Nothing waiting to be picked or packed." />
    </div>
  );
}
