import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getExpenseById } from "@/modules/finance/queries";
import { getSupplierOptions } from "@/modules/purchase-orders/queries";
import { updateExpense, deleteExpense } from "@/modules/finance/actions";
import { ExpenseForm } from "@/modules/finance/components/expense-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.FINANCE_WRITE);
  const { id } = await params;
  const [expense, suppliers] = await Promise.all([getExpenseById(id), getSupplierOptions()]);
  if (!expense) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{`Edit EXP-${String(expense.seq).padStart(4, "0")}`}</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteExpense.bind(null, id)}
            confirmMessage={`Delete EXP-${String(expense.seq).padStart(4, "0")}? This cannot be undone.`}
          />
        )}
      </div>
      <ExpenseForm action={updateExpense.bind(null, id)} suppliers={suppliers} expense={expense} />
    </div>
  );
}
