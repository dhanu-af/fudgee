import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getDispatchQueue } from "@/modules/shipping/queries";
import { ShipmentsTable } from "@/modules/shipping/components/shipments-table";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function DispatchPage() {
  const session = await requirePermission(PERMISSIONS.SHIPPING_READ);
  const shipments = await getDispatchQueue();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/shipping/dispatch" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Dispatch</h1>
      <p className="text-sm text-muted-foreground">
        Packed and ready to leave the warehouse — open one to capture dispatch details.
      </p>
      <ShipmentsTable
        data={shipments}
        canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)}
        emptyMessage="Nothing ready to dispatch."
      />
    </div>
  );
}
