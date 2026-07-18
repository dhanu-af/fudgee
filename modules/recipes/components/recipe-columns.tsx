"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

export type RecipeRow = {
  id: string;
  name: string | null;
  product: { sku: string; name: string };
};

export const recipeColumns: ColumnDef<RecipeRow>[] = [
  {
    accessorKey: "product",
    header: "Finished good",
    cell: ({ row }) => (
      <Link href={`/production/recipes/${row.original.id}`} className="font-medium hover:underline">
        {`${row.original.product.name} (${row.original.product.sku})`}
      </Link>
    ),
  },
  { accessorKey: "name", header: "Recipe name", cell: ({ row }) => row.original.name ?? "—" },
];
