"use client";

import { DataTable } from "@/components/data-table/data-table";
import { readyToShipColumns, type ReadyToShipRow } from "@/modules/shipping/components/ready-to-ship-columns";

export function ReadyToShipTable({ data }: { data: ReadyToShipRow[] }) {
  return <DataTable columns={readyToShipColumns} data={data} emptyMessage="No confirmed orders waiting to ship." />;
}
