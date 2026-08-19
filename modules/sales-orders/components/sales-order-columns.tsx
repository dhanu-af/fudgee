"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type SalesOrderRow = {
  id: string;
  seq: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  outOfDeliveryRange: boolean;
  orderDate: Date;
  total: unknown;
  customer: { name: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  CONFIRMED: "outline",
  FULFILLED: "default",
  CANCELLED: "destructive",
};

const paymentStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "secondary",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
};

const paymentMethodLabel: Record<string, string> = {
  STRIPE: "Card",
  CASH: "Cash",
  PAYID: "PayID",
  OTHER: "—",
};

export const salesOrderColumns: ColumnDef<SalesOrderRow>[] = [
  {
    accessorKey: "seq",
    header: "SO #",
    cell: ({ row }) => (
      <Link href={`/sales-orders/${row.original.id}`} className="font-medium hover:underline">
        {`SO-${String(row.original.seq).padStart(4, "0")}`}
      </Link>
    ),
  },
  { accessorKey: "customer", header: "Customer", cell: ({ row }) => row.original.customer.name },
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
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant={paymentStatusVariant[row.original.paymentStatus] ?? "secondary"}>
        {row.original.paymentStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment option",
    cell: ({ row }) =>
      row.original.outOfDeliveryRange ? (
        <Badge variant="destructive">Over delivery range</Badge>
      ) : (
        paymentMethodLabel[row.original.paymentMethod] ?? row.original.paymentMethod
      ),
  },
  { accessorKey: "total", header: "Total", cell: ({ row }) => String(row.original.total) },
];
