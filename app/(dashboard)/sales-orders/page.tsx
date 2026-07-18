import { ShoppingCart } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default async function SalesOrdersPage() {
  await requirePermission(PERMISSIONS.SALES_ORDERS_READ);
  return <ComingSoonPage title="Sales Orders" icon={ShoppingCart} milestone="M3" />;
}
