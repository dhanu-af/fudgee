"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type DeliverySuburbOverrideRow = {
  id: string;
  suburb: string | null;
  postcode: string | null;
  isActive: boolean;
  zone: { label: string | null; fee: unknown };
};

export const deliverySuburbOverrideColumns: ColumnDef<DeliverySuburbOverrideRow>[] = [
  {
    id: "match",
    header: "Matches",
    cell: ({ row }) => (
      <Link href={`/storefront/delivery/overrides/${row.original.id}`} className="font-medium hover:underline">
        {[row.original.suburb, row.original.postcode].filter(Boolean).join(" / ") || "—"}
      </Link>
    ),
  },
  {
    id: "zone",
    header: "Assigned zone",
    cell: ({ row }) => `${row.original.zone.label ?? "Zone"} — $${Number(row.original.zone.fee).toFixed(2)}`,
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
