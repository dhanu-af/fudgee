"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type PurchaseOrderRow = {
  id: string;
  seq: number;
  status: string;
  orderDate: Date;
  total: unknown;
  supplier: { name: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "outline",
  RECEIVED: "default",
  CANCELLED: "destructive",
};

export const purchaseOrderColumns: ColumnDef<PurchaseOrderRow>[] = [
  {
    accessorKey: "seq",
    header: "PO #",
    cell: ({ row }) => (
      <Link href={`/purchase-orders/${row.original.id}`} className="font-medium hover:underline">
        {`PO-${String(row.original.seq).padStart(4, "0")}`}
      </Link>
    ),
  },
  { accessorKey: "supplier", header: "Supplier", cell: ({ row }) => row.original.supplier.name },
  {
    accessorKey: "orderDate",
    header: "Order date",
    cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>
    ),
  },
  { accessorKey: "total", header: "Total", cell: ({ row }) => String(row.original.total) },
];
