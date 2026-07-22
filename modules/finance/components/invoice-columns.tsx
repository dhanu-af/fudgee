"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type InvoiceRow = {
  id: string;
  seq: number;
  issueDate: Date;
  dueDate: Date | null;
  totalAmount: unknown;
  paidTotal: number;
  status: "UNPAID" | "PARTIALLY_PAID" | "PAID";
  customer: { name: string };
};

const STATUS_VARIANT: Record<InvoiceRow["status"], "default" | "secondary" | "destructive"> = {
  UNPAID: "destructive",
  PARTIALLY_PAID: "secondary",
  PAID: "default",
};

const STATUS_LABEL: Record<InvoiceRow["status"], string> = {
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
};

export function getInvoiceColumns(): ColumnDef<InvoiceRow>[] {
  return [
    {
      accessorKey: "seq",
      header: "Invoice #",
      cell: ({ row }) => (
        <Link href={`/finance/invoices/${row.original.id}`} className="font-medium hover:underline">
          {`INV-${String(row.original.seq).padStart(4, "0")}`}
        </Link>
      ),
    },
    { accessorKey: "customer", header: "Customer", cell: ({ row }) => row.original.customer.name },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => new Date(row.original.issueDate).toLocaleDateString(),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "—"),
    },
    { accessorKey: "totalAmount", header: "Total", cell: ({ row }) => Number(row.original.totalAmount).toFixed(2) },
    {
      accessorKey: "paidTotal",
      header: "Paid",
      cell: ({ row }) => row.original.paidTotal.toFixed(2),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{STATUS_LABEL[row.original.status]}</Badge>,
    },
  ];
}
