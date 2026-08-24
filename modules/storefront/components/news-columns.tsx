"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type NewsItemRow = {
  id: string;
  title: string;
  badge: string | null;
  publishedAt: Date;
  sortOrder: number;
  isActive: boolean;
};

export const newsItemColumns: ColumnDef<NewsItemRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/storefront/news/${row.original.id}`} className="font-medium hover:underline">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "badge",
    header: "Badge",
    cell: ({ row }) => row.original.badge || "—",
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => new Date(row.original.publishedAt).toLocaleDateString(),
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
