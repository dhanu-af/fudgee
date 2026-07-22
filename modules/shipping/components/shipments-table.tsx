"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getShipmentColumns, type ShipmentRow } from "@/modules/shipping/components/shipments-columns";

export function ShipmentsTable({
  data,
  canDelete,
  emptyMessage,
}: {
  data: ShipmentRow[];
  canDelete: boolean;
  emptyMessage?: string;
}) {
  const columns = useMemo(() => getShipmentColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage={emptyMessage ?? "No shipments yet."} />;
}
