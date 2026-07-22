"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getReadyToShipColumns, type ReadyToShipRow } from "@/modules/shipping/components/ready-to-ship-columns";

export function ReadyToShipTable({ data, canDelete }: { data: ReadyToShipRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getReadyToShipColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No confirmed orders waiting to ship." />;
}
