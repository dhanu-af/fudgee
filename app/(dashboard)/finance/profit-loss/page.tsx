import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getProfitAndLoss, resolveRange } from "@/modules/finance/queries";
import { PnlReport } from "@/modules/finance/components/pnl-report";
import { FinanceRangeForm } from "@/modules/finance/components/finance-range-form";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function ProfitAndLossPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requirePermission(PERMISSIONS.FINANCE_READ);
  const { from, to } = await searchParams;
  const range = resolveRange(from, to);
  const data = await getProfitAndLoss(range.from, range.to);

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/profit-loss" tabs={FINANCE_TABS} />
      <h1 className="text-xl font-semibold">Profit &amp; Loss</h1>
      <FinanceRangeForm
        action="/finance/profit-loss"
        from={range.from.toISOString().slice(0, 10)}
        to={range.to.toISOString().slice(0, 10)}
      />
      <PnlReport data={data} />
    </div>
  );
}
