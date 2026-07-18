import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getQualityChecks } from "@/modules/quality/queries";
import { QualityCheckTable } from "@/modules/quality/components/quality-check-table";
import { Button } from "@/components/ui/button";

export default async function QualityPage() {
  const session = await requirePermission(PERMISSIONS.QUALITY_READ);
  const checks = await getQualityChecks();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quality Control</h1>
        {can(session, PERMISSIONS.QUALITY_WRITE) && (
          <Button render={<Link href="/quality/new" />}>Record check</Button>
        )}
      </div>
      <QualityCheckTable data={checks} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
    </div>
  );
}
