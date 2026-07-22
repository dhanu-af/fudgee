import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getInvoices, getArAging } from "@/modules/finance/queries";
import { InvoiceTable } from "@/modules/finance/components/invoice-table";
import { ArAgingCard } from "@/modules/finance/components/ar-aging-card";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function InvoicesPage() {
  const session = await requirePermission(PERMISSIONS.FINANCE_READ);
  const [invoices, arAging] = await Promise.all([getInvoices(), getArAging()]);

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/invoices" tabs={FINANCE_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        {can(session, PERMISSIONS.FINANCE_WRITE) && (
          <Button render={<Link href="/finance/invoices/new" />}>New invoice</Button>
        )}
      </div>
      <ArAgingCard buckets={arAging.buckets} totalOutstanding={arAging.totalOutstanding} />
      <InvoiceTable data={invoices} />
    </div>
  );
}
