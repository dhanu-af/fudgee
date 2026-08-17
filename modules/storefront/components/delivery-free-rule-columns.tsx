"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type DeliveryFreeRuleRow = {
  id: string;
  minOrderValue: unknown;
  maxKm: unknown;
  label: string;
  priority: number;
  isActive: boolean;
};

export const deliveryFreeRuleColumns: ColumnDef<DeliveryFreeRuleRow>[] = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <Link href={`/storefront/delivery/rules/${row.original.id}`} className="font-medium hover:underline">
        {row.original.label}
      </Link>
    ),
  },
  {
    id: "condition",
    header: "Condition",
    cell: ({ row }) => `Order ≥ $${Number(row.original.minOrderValue).toFixed(2)} within ${Number(row.original.maxKm)} km`,
  },
  { accessorKey: "priority", header: "Priority" },
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
