import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getSuppliers } from "@/modules/suppliers/queries";
import { supplierColumns } from "@/modules/suppliers/components/supplier-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";

export default async function SuppliersPage() {
  const session = await requirePermission(PERMISSIONS.PURCHASE_ORDERS_READ);
  const suppliers = await getSuppliers();

  return (
    <div className="flex flex-col gap-4">
      <TabNav
        active="/purchase-orders/suppliers"
        tabs={[
          { label: "Orders", href: "/purchase-orders" },
          { label: "Suppliers", href: "/purchase-orders/suppliers" },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        {can(session, PERMISSIONS.PURCHASE_ORDERS_WRITE) && (
          <Button render={<Link href="/purchase-orders/suppliers/new" />}>New supplier</Button>
        )}
      </div>
      <DataTable columns={supplierColumns} data={suppliers} emptyMessage="No suppliers yet." />
    </div>
  );
}
