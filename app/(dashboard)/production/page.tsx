import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getProductionBatches } from "@/modules/production/queries";
import { productionBatchColumns } from "@/modules/production/components/production-batch-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function ProductionPage() {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const batches = await getProductionBatches();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Production</h1>
        {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
          <Button render={<Link href="/production/new" />}>New batch</Button>
        )}
      </div>
      <DataTable columns={productionBatchColumns} data={batches} emptyMessage="No production batches yet." />
    </div>
  );
}
