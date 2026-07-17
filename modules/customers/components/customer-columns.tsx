"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

export type CustomerRow = {
  id: string;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

export const customerColumns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/customers/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
];
