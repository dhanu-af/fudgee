"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

export type BatchCalculationRow = {
  id: string;
  seq: number;
  batchNumber: string | null;
  requiredBatchSize: unknown;
  calculationDate: Date;
  enteredBy: string | null;
  recipeId: string;
};

export const batchCalculationColumns: ColumnDef<BatchCalculationRow>[] = [
  {
    accessorKey: "seq",
    header: "Calc #",
    cell: ({ row }) => (
      <Link
        href={`/production/recipes/${row.original.recipeId}/calculations/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.batchNumber || `CALC-${String(row.original.seq).padStart(4, "0")}`}
      </Link>
    ),
  },
  { accessorKey: "requiredBatchSize", header: "Batch size", cell: ({ row }) => String(row.original.requiredBatchSize) },
  {
    accessorKey: "calculationDate",
    header: "Date",
    cell: ({ row }) => new Date(row.original.calculationDate).toLocaleDateString(),
  },
  { accessorKey: "enteredBy", header: "Entered by", cell: ({ row }) => row.original.enteredBy ?? "—" },
];
