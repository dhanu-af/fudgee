"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deleteCarrier } from "@/modules/shipping/actions";

export type CarrierRow = {
  id: string;
  name: string;
  contactPhone: string | null;
  contactEmail: string | null;
  isActive: boolean;
};

export function getCarrierColumns(canDelete: boolean): ColumnDef<CarrierRow>[] {
  const columns: ColumnDef<CarrierRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/shipping/carriers/${row.original.id}`} className="font-medium hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: "contactPhone", header: "Phone", cell: ({ row }) => row.original.contactPhone ?? "—" },
    { accessorKey: "contactEmail", header: "Email", cell: ({ row }) => row.original.contactEmail ?? "—" },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.isActive ? "default" : "secondary"}>{row.original.isActive ? "Active" : "Inactive"}</Badge>,
    },
  ];

  if (canDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeleteRowButton
          action={deleteCarrier.bind(null, row.original.id)}
          confirmMessage={`Delete "${row.original.name}"? This cannot be undone.`}
        />
      ),
    });
  }

  return columns;
}
