import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFinanceDashboardData } from "@/modules/finance/queries";
import { FinanceDashboardCards } from "@/modules/finance/components/finance-dashboard-cards";
import { DailyRevenueChart } from "@/modules/finance/components/daily-revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabNav } from "@/components/layout/tab-nav";
import { FINANCE_TABS } from "@/modules/finance/nav";

export default async function FinanceDashboardPage() {
  await requirePermission(PERMISSIONS.FINANCE_READ);
  const data = await getFinanceDashboardData();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/finance" tabs={FINANCE_TABS} />
      <h1 className="text-xl font-semibold">Finance</h1>
      <FinanceDashboardCards data={data} />
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue — Day by Day (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyRevenueChart data={data.dailyRevenue} />
        </CardContent>
      </Card>
    </div>
  );
}
