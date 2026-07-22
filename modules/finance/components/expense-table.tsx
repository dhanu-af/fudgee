"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getExpenseColumns, type ExpenseRow } from "@/modules/finance/components/expense-columns";

export function ExpenseTable({ data, canDelete }: { data: ExpenseRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getExpenseColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No expenses recorded yet." />;
}
