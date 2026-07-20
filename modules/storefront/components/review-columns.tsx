"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type ReviewRow = {
  id: string;
  customerName: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  product: { name: string } | null;
};

export const reviewColumns: ColumnDef<ReviewRow>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <Link href={`/storefront/reviews/${row.original.id}`} className="font-medium hover:underline">
        {row.original.customerName}
      </Link>
    ),
  },
  {
    id: "product",
    header: "For",
    cell: ({ row }) => row.original.product?.name ?? <span className="text-muted-foreground">Site-wide</span>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => "★".repeat(row.original.rating) + "☆".repeat(5 - row.original.rating),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.original.isFeatured ? <Badge variant="outline">Featured</Badge> : null),
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
