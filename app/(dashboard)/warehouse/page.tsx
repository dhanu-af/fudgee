import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getLocations } from "@/modules/warehouse/queries";
import { locationColumns } from "@/modules/warehouse/components/location-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function WarehousePage() {
  const session = await requirePermission(PERMISSIONS.WAREHOUSE_READ);
  const locations = await getLocations();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Warehouse</h1>
        {can(session, PERMISSIONS.WAREHOUSE_WRITE) && (
          <Button render={<Link href="/warehouse/new" />}>New location</Button>
        )}
      </div>
      <DataTable columns={locationColumns} data={locations} emptyMessage="No locations yet." />
    </div>
  );
}
