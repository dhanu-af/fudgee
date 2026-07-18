import { Package } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function InventoryPage() {
  await requirePermission(PERMISSIONS.INVENTORY_READ);
  return <ComingSoonPage title="Inventory" icon={Package} milestone="M4" />;
}
