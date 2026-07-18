import { FlaskConical } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function QualityPage() {
  await requirePermission(PERMISSIONS.QUALITY_READ);
  return <ComingSoonPage title="Quality Control" icon={FlaskConical} milestone="M5" />;
}
