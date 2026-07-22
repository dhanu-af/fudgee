"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deleteAsset } from "@/modules/finance/actions";

export type AssetRow = {
  id: string;
  seq: number;
  name: string;
  category: string;
  status: string;
  purchaseDate: Date;
  purchaseCost: unknown;
  bookValue: number;
  isFullyDepreciated: boolean;
};

export function getAssetColumns(canDelete: boolean): ColumnDef<AssetRow>[] {
  const columns: ColumnDef<AssetRow>[] = [
    {
      accessorKey: "seq",
      header: "Asset #",
      cell: ({ row }) => (
        <Link href={`/finance/assets/${row.original.id}`} className="font-medium hover:underline">
          {`AST-${String(row.original.seq).padStart(4, "0")}`}
        </Link>
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category", cell: ({ row }) => row.original.category.replace(/_/g, " ") },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => new Date(row.original.purchaseDate).toLocaleDateString(),
    },
    { accessorKey: "purchaseCost", header: "Cost", cell: ({ row }) => Number(row.original.purchaseCost).toFixed(2) },
    {
      accessorKey: "bookValue",
      header: "Book Value",
      cell: ({ row }) => (
        <span>
          {row.original.bookValue.toFixed(2)}
          {row.original.isFullyDepreciated && (
            <Badge variant="secondary" className="ml-2">
              Fully depreciated
            </Badge>
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status === "ACTIVE" ? "default" : "secondary"}>{row.original.status}</Badge>,
    },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton
          action={deleteAsset.bind(null, row.original.id)}
          confirmMessage={`Delete AST-${String(row.original.seq).padStart(4, "0")}? This cannot be undone.`}
        />
      ),
    });
  }

  return columns;
}
