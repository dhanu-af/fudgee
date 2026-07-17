import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCustomers } from "@/modules/customers/queries";
import { customerColumns } from "@/modules/customers/components/customer-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function CustomersPage() {
  const session = await requirePermission(PERMISSIONS.CUSTOMERS_READ);
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customers</h1>
        {can(session, PERMISSIONS.CUSTOMERS_WRITE) && (
          <Button render={<Link href="/customers/new" />}>New customer</Button>
        )}
      </div>
      <DataTable columns={customerColumns} data={customers} emptyMessage="No customers yet." />
    </div>
  );
}
