"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getCarrierColumns, type CarrierRow } from "@/modules/shipping/components/carrier-columns";

export function CarrierTable({ data, canDelete }: { data: CarrierRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getCarrierColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No carriers added yet." />;
}
