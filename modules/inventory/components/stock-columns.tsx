"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type StockRow = {
  productId: string;
  locationId: string;
  productSku: string;
  productName: string;
  locationName: string;
  onHand: number;
};

export const stockColumns: ColumnDef<StockRow>[] = [
  { accessorKey: "productSku", header: "SKU" },
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "locationName", header: "Location" },
  {
    accessorKey: "onHand",
    header: "On hand",
    cell: ({ row }) => <span className="font-medium">{row.original.onHand}</span>,
  },
];
