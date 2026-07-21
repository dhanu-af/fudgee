"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ShipmentStatusBadge } from "@/modules/shipping/components/shipment-status-badge";

export type ShipmentRow = {
  id: string;
  seq: number;
  trackingNumber: string | null;
  shipDate: Date | null;
  status: string;
  freightCost: unknown;
  salesOrder: { seq: number; customer: { name: string } };
  carrier: { name: string } | null;
};

export const shipmentColumns: ColumnDef<ShipmentRow>[] = [
  {
    accessorKey: "seq",
    header: "Shipment #",
    cell: ({ row }) => (
      <Link href={`/shipping/shipments/${row.original.id}`} className="font-medium hover:underline">
        {`SHIP-${String(row.original.seq).padStart(4, "0")}`}
      </Link>
    ),
  },
  {
    accessorKey: "salesOrder",
    header: "Sales Order",
    cell: ({ row }) => `SO-${String(row.original.salesOrder.seq).padStart(4, "0")}`,
  },
  { accessorKey: "customer", header: "Customer", cell: ({ row }) => row.original.salesOrder.customer.name },
  { accessorKey: "carrier", header: "Carrier", cell: ({ row }) => row.original.carrier?.name ?? "—" },
  { accessorKey: "trackingNumber", header: "Tracking Number", cell: ({ row }) => row.original.trackingNumber ?? "—" },
  {
    accessorKey: "shipDate",
    header: "Ship Date",
    cell: ({ row }) => (row.original.shipDate ? new Date(row.original.shipDate).toLocaleDateString() : "—"),
  },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <ShipmentStatusBadge status={row.original.status} /> },
  {
    accessorKey: "freightCost",
    header: "Freight Cost",
    cell: ({ row }) => (row.original.freightCost ? String(row.original.freightCost) : "—"),
  },
];
