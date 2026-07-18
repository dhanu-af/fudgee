"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

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

export const transactionColumns: ColumnDef<TransactionRow>[] = [
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
