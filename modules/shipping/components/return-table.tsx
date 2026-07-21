"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getReturnColumns, type ReturnRow } from "@/modules/shipping/components/return-columns";

export function ReturnTable({ data, canDelete }: { data: ReturnRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getReturnColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No returns recorded yet." />;
}
