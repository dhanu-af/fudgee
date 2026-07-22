"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getInvoiceColumns, type InvoiceRow } from "@/modules/finance/components/invoice-columns";

export function InvoiceTable({ data }: { data: InvoiceRow[] }) {
  const columns = useMemo(() => getInvoiceColumns(), []);
  return <DataTable columns={columns} data={data} emptyMessage="No invoices created yet." />;
}
