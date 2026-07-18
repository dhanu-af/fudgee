"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: { name: string };
};

export const userColumns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => row.original.role.name,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
