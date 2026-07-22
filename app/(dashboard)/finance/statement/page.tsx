import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getStatement, resolveRange } from "@/modules/finance/queries";
import { withRunningBalance } from "@/modules/finance/lib/statement";
import { StatementTable } from "@/modules/finance/components/statement-table";
import { FinanceRangeForm } from "@/modules/finance/components/finance-range-form";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function StatementPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requirePermission(PERMISSIONS.FINANCE_READ);
  const { from, to } = await searchParams;
  const range = resolveRange(from, to);
  const entries = await getStatement(range.from, range.to);
  const rows = withRunningBalance(entries);
  const fromStr = range.from.toISOString().slice(0, 10);
  const toStr = range.to.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance/statement" tabs={FINANCE_TABS} />
      <h1 className="text-xl font-semibold">Statement</h1>
      <FinanceRangeForm
        action="/finance/statement"
        from={fromStr}
        to={toStr}
        extra={
          <Button
            type="button"
            variant="outline"
            render={<Link href={`/api/finance/statement-csv?from=${fromStr}&to=${toStr}`} />}
          >
            Export CSV
          </Button>
        }
      />
      <StatementTable rows={rows} openingBalance={0} />
    </div>
  );
}
