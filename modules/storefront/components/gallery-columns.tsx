"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type GalleryItemRow = {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  isActive: boolean;
};

export const galleryColumns: ColumnDef<GalleryItemRow>[] = [
  {
    id: "preview",
    header: "",
    cell: ({ row }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={row.original.imageUrl}
        alt=""
        className="size-10 rounded-md object-cover ring-1 ring-border/60"
      />
    ),
  },
  {
    accessorKey: "caption",
    header: "Caption",
    cell: ({ row }) => (
      <Link href={`/storefront/gallery/${row.original.id}`} className="font-medium hover:underline">
        {row.original.caption || "(no caption)"}
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
