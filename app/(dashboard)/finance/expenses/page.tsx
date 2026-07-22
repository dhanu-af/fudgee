import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getExpenses } from "@/modules/finance/queries";
import { ExpenseTable } from "@/modules/finance/components/expense-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function ExpensesPage() {
  const session = await requirePermission(PERMISSIONS.FINANCE_READ);
  const expenses = await getExpenses();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/expenses" tabs={FINANCE_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Expenses</h1>
        {can(session, PERMISSIONS.FINANCE_WRITE) && (
          <Button render={<Link href="/finance/expenses/new" />}>New expense</Button>
        )}
      </div>
      <ExpenseTable data={expenses} canDelete={can(session, PERMISSIONS.SYSTEM_DELETE)} />
    </div>
  );
}
