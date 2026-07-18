import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getSalesOrders } from "@/modules/sales-orders/queries";
import { salesOrderColumns } from "@/modules/sales-orders/components/sales-order-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function SalesOrdersPage() {
  const session = await requirePermission(PERMISSIONS.SALES_ORDERS_READ);
  const salesOrders = await getSalesOrders();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sales Orders</h1>
        {can(session, PERMISSIONS.SALES_ORDERS_WRITE) && (
          <Button render={<Link href="/sales-orders/new" />}>New sales order</Button>
        )}
      </div>
      <DataTable columns={salesOrderColumns} data={salesOrders} emptyMessage="No sales orders yet." />
    </div>
  );
}
