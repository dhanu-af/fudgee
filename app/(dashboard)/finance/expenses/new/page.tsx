import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSupplierOptions } from "@/modules/purchase-orders/queries";
import { createExpense } from "@/modules/finance/actions";
import { ExpenseForm } from "@/modules/finance/components/expense-form";

export default async function NewExpensePage() {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);
  const suppliers = await getSupplierOptions();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New expense</h1>
      <ExpenseForm action={createExpense} suppliers={suppliers} />
    </div>
  );
}
