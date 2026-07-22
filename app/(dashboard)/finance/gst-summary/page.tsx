import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getGstSummary } from "@/modules/finance/queries";
import { GstSummaryTable } from "@/modules/finance/components/gst-summary-table";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function GstSummaryPage() {
  await requirePermission(PERMISSIONS.FINANCE_READ);
  const data = await getGstSummary();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/gst-summary" tabs={FINANCE_TABS} />
      <h1 className="text-xl font-semibold">GST Summary</h1>
      <p className="text-sm text-muted-foreground">
        Collected is drawn from confirmed sales orders&apos; GST component. Paid is an estimate — it only reflects
        GST entered manually on Expenses.
      </p>
      <GstSummaryTable data={data} />
    </div>
  );
}
