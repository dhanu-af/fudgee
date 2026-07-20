"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type FaqItemRow = {
  id: string;
  question: string;
  sortOrder: number;
  isActive: boolean;
};

export const faqColumns: ColumnDef<FaqItemRow>[] = [
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <Link href={`/storefront/faq/${row.original.id}`} className="font-medium hover:underline">
        {row.original.question}
      </Link>
    ),
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
