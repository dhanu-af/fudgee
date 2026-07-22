import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { getFinanceDashboardData } from "@/modules/finance/queries";

type DashboardData = Awaited<ReturnType<typeof getFinanceDashboardData>>;

export function FinanceDashboardCards({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{data.revenueMtd.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Year to date: {data.revenueYtd.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{data.netProfitMtd.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Year to date: {data.netProfitYtd.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{data.arOutstanding.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{data.outstandingInvoiceCount} unpaid/partially paid invoices</p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Depreciation (this month)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{data.depreciationThisMonth.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">non-cash, from the Asset register</p>
        </CardContent>
      </Card>

      {data.hasNullCostRecent && (
        <Card className="border-amber-500/40 sm:col-span-2 xl:col-span-3">
          <CardContent className="pt-6 text-sm text-amber-600 dark:text-amber-400">
            Some recent sales order lines have no cost recorded — COGS and margin figures may be understated until
            affected products have a Cost Price set.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
