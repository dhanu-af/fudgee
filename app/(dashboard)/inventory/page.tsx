import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getStockLevels, getRecentTransactions } from "@/modules/inventory/queries";
import { stockColumns } from "@/modules/inventory/components/stock-columns";
import { TransactionTable } from "@/modules/inventory/components/transaction-table";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function InventoryPage() {
  const session = await requirePermission(PERMISSIONS.INVENTORY_READ);
  const [stockLevels, transactions] = await Promise.all([getStockLevels(), getRecentTransactions()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Inventory</h1>
          {can(session, PERMISSIONS.INVENTORY_WRITE) && (
            <Button render={<Link href="/inventory/adjust" />}>Record adjustment</Button>
          )}
        </div>
        <DataTable columns={stockColumns} data={stockLevels} emptyMessage="No stock movements recorded yet." />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Recent transactions</h2>
        <TransactionTable data={transactions} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
      </div>
    </div>
  );
}
