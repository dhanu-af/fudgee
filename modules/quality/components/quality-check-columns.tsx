"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deleteQualityCheck } from "@/modules/quality/actions";

export type QualityCheckRow = {
  id: string;
  result: string;
  checkedAt: Date | null;
  notes: string | null;
  productionBatch: { id: string; seq: number; product: { sku: string; name: string } };
};

const resultVariant: Record<string, "default" | "secondary" | "destructive"> = {
  PASS: "default",
  FAIL: "destructive",
  PENDING: "secondary",
};

export function getQualityCheckColumns(canDelete: boolean): ColumnDef<QualityCheckRow>[] {
  const columns: ColumnDef<QualityCheckRow>[] = [
    {
      accessorKey: "productionBatch",
      header: "Batch",
      cell: ({ row }) => (
        <Link href={`/production/${row.original.productionBatch.id}`} className="font-medium hover:underline">
          {`BATCH-${String(row.original.productionBatch.seq).padStart(4, "0")}`}
        </Link>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) =>
        `${row.original.productionBatch.product.name} (${row.original.productionBatch.product.sku})`,
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => (
        <Badge variant={resultVariant[row.original.result] ?? "secondary"}>{row.original.result}</Badge>
      ),
    },
    {
      accessorKey: "checkedAt",
      header: "Checked at",
      cell: ({ row }) => (row.original.checkedAt ? new Date(row.original.checkedAt).toLocaleString() : "—"),
    },
    { accessorKey: "notes", header: "Notes" },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton
          action={deleteQualityCheck.bind(null, row.original.id)}
          confirmMessage="Delete this quality check? This cannot be undone."
        />
      ),
    });
  }

  return columns;
}
