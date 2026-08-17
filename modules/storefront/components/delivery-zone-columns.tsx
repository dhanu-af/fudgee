"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type DeliveryZoneRow = {
  id: string;
  minKm: unknown;
  maxKm: unknown;
  fee: unknown;
  label: string | null;
  isActive: boolean;
};

export const deliveryZoneColumns: ColumnDef<DeliveryZoneRow>[] = [
  {
    id: "range",
    header: "Distance",
    cell: ({ row }) => {
      const { minKm, maxKm } = row.original;
      return (
        <Link href={`/storefront/delivery/zones/${row.original.id}`} className="font-medium hover:underline">
          {Number(minKm)}–{maxKm != null ? `${Number(maxKm)} km` : "km+"}
        </Link>
      );
    },
  },
  { accessorKey: "label", header: "Label", cell: ({ row }) => row.original.label ?? "—" },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => `$${Number(row.original.fee).toFixed(2)}`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Hidden"}
      </Badge>
    ),
  },
];
