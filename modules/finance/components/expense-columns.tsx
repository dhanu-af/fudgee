"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deleteExpense } from "@/modules/finance/actions";

export type ExpenseRow = {
  id: string;
  seq: number;
  date: Date;
  category: string;
  amount: unknown;
  paymentMethod: string;
  supplier: { name: string } | null;
};

export function getExpenseColumns(canDelete: boolean): ColumnDef<ExpenseRow>[] {
  const columns: ColumnDef<ExpenseRow>[] = [
    {
      accessorKey: "seq",
      header: "Expense #",
      cell: ({ row }) => (
        <Link href={`/finance/expenses/${row.original.id}`} className="font-medium hover:underline">
          {`EXP-${String(row.original.seq).padStart(4, "0")}`}
        </Link>
      ),
    },
    { accessorKey: "date", header: "Date", cell: ({ row }) => new Date(row.original.date).toLocaleDateString() },
    { accessorKey: "category", header: "Category", cell: ({ row }) => row.original.category.replace(/_/g, " ") },
    { accessorKey: "supplier", header: "Supplier", cell: ({ row }) => row.original.supplier?.name ?? "—" },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => row.original.paymentMethod.replace(/_/g, " "),
    },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => Number(row.original.amount).toFixed(2) },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton
          action={deleteExpense.bind(null, row.original.id)}
          confirmMessage={`Delete EXP-${String(row.original.seq).padStart(4, "0")}? This cannot be undone.`}
        />
      ),
    });
  }

  return columns;
}
