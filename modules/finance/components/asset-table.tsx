"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getAssetColumns, type AssetRow } from "@/modules/finance/components/asset-columns";

export function AssetTable({ data, canDelete }: { data: AssetRow[]; canDelete: boolean }) {
  const columns = useMemo(() => getAssetColumns(canDelete), [canDelete]);
  return <DataTable columns={columns} data={data} emptyMessage="No assets recorded yet." />;
}
