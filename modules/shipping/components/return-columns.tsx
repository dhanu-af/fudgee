"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { ReturnStatusSelect } from "@/modules/shipping/components/return-status-select";
import { deleteReturn } from "@/modules/shipping/actions";

export type ReturnRow = {
  id: string;
  seq: number;
  reason: string;
  quantity: unknown;
  refundAmount: unknown;
  status: string;
  customer: { name: string };
  shipment: { seq: number } | null;
};

export function getReturnColumns(canDelete: boolean): ColumnDef<ReturnRow>[] {
  const columns: ColumnDef<ReturnRow>[] = [
    { accessorKey: "seq", header: "RMA #", cell: ({ row }) => `RMA-${String(row.original.seq).padStart(4, "0")}` },
    { accessorKey: "customer", header: "Customer", cell: ({ row }) => row.original.customer.name },
    {
      accessorKey: "shipment",
      header: "Shipment",
      cell: ({ row }) => (row.original.shipment ? `SHIP-${String(row.original.shipment.seq).padStart(4, "0")}` : "—"),
    },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "quantity", header: "Quantity", cell: ({ row }) => String(row.original.quantity) },
    {
      accessorKey: "refundAmount",
      header: "Refund",
      cell: ({ row }) => (row.original.refundAmount ? String(row.original.refundAmount) : "—"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ReturnStatusSelect id={row.original.id} status={row.original.status} />,
    },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton action={deleteReturn.bind(null, row.original.id)} confirmMessage="Delete this return? This cannot be undone." />
      ),
    });
  }

  return columns;
}
