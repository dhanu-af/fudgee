"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type ProductRow = {
  id: string;
  sku: string;
  name: string;
  type: string;
  uom: string;
  status: string;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  DISCONTINUED: "destructive",
};

export const productColumns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`} className="font-medium hover:underline">
        {row.original.sku}
      </Link>
    ),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "uom", header: "UoM" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>
    ),
  },
];
