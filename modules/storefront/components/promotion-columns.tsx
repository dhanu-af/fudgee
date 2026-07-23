"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type PromotionRow = {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: number;
  isActive: boolean;
};

export const promotionColumns: ColumnDef<PromotionRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/storefront/promotions/${row.original.id}`} className="font-medium hover:underline">
        {row.original.title}
      </Link>
    ),
  },
  {
    id: "window",
    header: "Runs",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      if (!startDate && !endDate) return "Always";
      const from = startDate ? new Date(startDate).toLocaleDateString() : "now";
      const to = endDate ? new Date(endDate).toLocaleDateString() : "no end date";
      return `${from} → ${to}`;
    },
  },
  { accessorKey: "sortOrder", header: "Order" },
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
