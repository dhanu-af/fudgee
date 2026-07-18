import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getPurchaseOrders } from "@/modules/purchase-orders/queries";
import { purchaseOrderColumns } from "@/modules/purchase-orders/components/purchase-order-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";

export default async function PurchaseOrdersPage() {
  const session = await requirePermission(PERMISSIONS.PURCHASE_ORDERS_READ);
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="flex flex-col gap-4">
      <TabNav
        active="/purchase-orders"
        tabs={[
          { label: "Orders", href: "/purchase-orders" },
          { label: "Suppliers", href: "/purchase-orders/suppliers" },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        {can(session, PERMISSIONS.PURCHASE_ORDERS_WRITE) && (
          <Button render={<Link href="/purchase-orders/new" />}>New purchase order</Button>
        )}
      </div>
      <DataTable columns={purchaseOrderColumns} data={purchaseOrders} emptyMessage="No purchase orders yet." />
    </div>
  );
}
