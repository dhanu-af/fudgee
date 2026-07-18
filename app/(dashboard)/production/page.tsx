import { Factory } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function ProductionPage() {
  await requirePermission(PERMISSIONS.PRODUCTION_READ);
  return <ComingSoonPage title="Production" icon={Factory} milestone="M5" />;
}
