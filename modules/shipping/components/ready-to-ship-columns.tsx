"use client";

import { useActionState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { createShipment } from "@/modules/shipping/actions";

export type ReadyToShipRow = {
  id: string;
  seq: number;
  orderDate: Date;
  requestedDate: Date | null;
  customer: { name: string };
};

function CreateShipmentButton({ salesOrderId }: { salesOrderId: string }) {
  const [state, formAction, pending] = useActionState(createShipment, {});
  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="salesOrderId" value={salesOrderId} />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Creating..." : "Create Shipment"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  );
}

export const readyToShipColumns: ColumnDef<ReadyToShipRow>[] = [
  {
    accessorKey: "seq",
    header: "SO #",
    cell: ({ row }) => `SO-${String(row.original.seq).padStart(4, "0")}`,
  },
  { accessorKey: "customer", header: "Customer", cell: ({ row }) => row.original.customer.name },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
  },
  {
    accessorKey: "requestedDate",
    header: "Required Ship Date",
    cell: ({ row }) =>
      row.original.requestedDate ? new Date(row.original.requestedDate).toLocaleDateString() : "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <CreateShipmentButton salesOrderId={row.original.id} />,
  },
];
