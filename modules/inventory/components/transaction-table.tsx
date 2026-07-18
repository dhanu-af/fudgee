"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getTransactionColumns, type TransactionRow } from "@/modules/inventory/components/transaction-columns";

export function TransactionTable({ data, canDelete }: { data: TransactionRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getTransactionColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No transactions yet." />;
}
