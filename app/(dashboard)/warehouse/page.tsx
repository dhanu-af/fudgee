import { Warehouse } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function WarehousePage() {
  await requirePermission(PERMISSIONS.WAREHOUSE_READ);
  return <ComingSoonPage title="Warehouse" icon={Warehouse} milestone="M4" />;
}
