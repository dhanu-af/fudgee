import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerProfitability, resolveRange } from "@/modules/finance/queries";
import { CustomerProfitabilityTable } from "@/modules/finance/components/customer-profitability-table";
import { FinanceRangeForm } from "@/modules/finance/components/finance-range-form";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function CustomerProfitabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requirePermission(PERMISSIONS.FINANCE_READ);
  const { from, to } = await searchParams;
  const range = resolveRange(from, to);
  const data = await getCustomerProfitability(range.from, range.to);

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/customer-profitability" tabs={FINANCE_TABS} />
      <h1 className="text-xl font-semibold">Customer Profitability</h1>
      <FinanceRangeForm
        action="/finance/customer-profitability"
        from={range.from.toISOString().slice(0, 10)}
        to={range.to.toISOString().slice(0, 10)}
      />
      <CustomerProfitabilityTable data={data} />
    </div>
  );
}
