"use client";

import { DataTable } from "@/components/data-table/data-table";
import { shipmentColumns, type ShipmentRow } from "@/modules/shipping/components/shipments-columns";

export function ShipmentsTable({ data, emptyMessage }: { data: ShipmentRow[]; emptyMessage?: string }) {
  return <DataTable columns={shipmentColumns} data={data} emptyMessage={emptyMessage ?? "No shipments yet."} />;
}
