"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getQualityCheckColumns, type QualityCheckRow } from "@/modules/quality/components/quality-check-columns";

export function QualityCheckTable({ data, canDelete }: { data: QualityCheckRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getQualityCheckColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No quality checks recorded yet." />;
}
