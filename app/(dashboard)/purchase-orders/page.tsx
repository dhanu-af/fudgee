import { Truck } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function PurchaseOrdersPage() {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_READ);
  return <ComingSoonPage title="Purchase Orders" icon={Truck} milestone="M3" />;
}
