import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFinanceDashboardData } from "@/modules/finance/queries";
import { FinanceDashboardCards } from "@/modules/finance/components/finance-dashboard-cards";
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
    </div>
  );
}
