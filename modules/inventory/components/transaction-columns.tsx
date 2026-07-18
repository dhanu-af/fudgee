"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deleteInventoryTransaction } from "@/modules/inventory/actions";

export type TransactionRow = {
  id: string;
  type: string;
  quantity: unknown;
  note: string | null;
  createdAt: Date;
  product: { sku: string; name: string };
  location: { name: string };
};

const typeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  RECEIPT: "default",
  ISSUE: "destructive",
  ADJUSTMENT: "secondary",
  TRANSFER_IN: "default",
  TRANSFER_OUT: "destructive",
};

export function getTransactionColumns(canDelete: boolean): ColumnDef<TransactionRow>[] {
  const columns: ColumnDef<TransactionRow>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => `${row.original.product.name} (${row.original.product.sku})`,
    },
    { accessorKey: "location", header: "Location", cell: ({ row }) => row.original.location.name },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant={typeVariant[row.original.type] ?? "secondary"}>{row.original.type}</Badge>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => String(row.original.quantity),
    },
    { accessorKey: "note", header: "Note" },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton
          action={deleteInventoryTransaction.bind(null, row.original.id)}
          confirmMessage="Delete this transaction? This will change the computed stock level. This cannot be undone."
        />
      ),
    });
  }

  return columns;
}
