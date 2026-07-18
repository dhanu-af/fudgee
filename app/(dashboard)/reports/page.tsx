import { BarChart3 } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_READ);
  return <ComingSoonPage title="Reports" icon={BarChart3} milestone="M6" />;
}
