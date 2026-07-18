"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type ProductionBatchRow = {
  id: string;
  seq: number;
  status: string;
  quantityPlanned: unknown;
  createdAt: Date;
  product: { sku: string; name: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PLANNED: "secondary",
  IN_PROGRESS: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export const productionBatchColumns: ColumnDef<ProductionBatchRow>[] = [
  {
    accessorKey: "seq",
    header: "Batch #",
    cell: ({ row }) => (
      <Link href={`/production/${row.original.id}`} className="font-medium hover:underline">
        {`BATCH-${String(row.original.seq).padStart(4, "0")}`}
      </Link>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => `${row.original.product.name} (${row.original.product.sku})`,
  },
  { accessorKey: "quantityPlanned", header: "Planned qty", cell: ({ row }) => String(row.original.quantityPlanned) },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>
    ),
  },
];
