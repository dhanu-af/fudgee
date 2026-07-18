import { Package, Users as UsersIcon, UserCog, Rocket, Activity } from "lucide-react";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS, ROLE_LABELS } from "@/lib/rbac/permissions";
import { getDashboardData } from "@/modules/dashboard/queries";
import { StatTile } from "@/modules/dashboard/components/stat-tile";
import { InventorySummaryCard } from "@/modules/inventory/components/inventory-summary-card";
import { ProductionOverviewCard } from "@/modules/production/components/production-overview-card";
import { QualitySummaryCard } from "@/modules/quality/components/quality-summary-card";
import { ActivityTimeline } from "@/modules/dashboard/components/activity-timeline";
import { BatchLookupCard } from "@/modules/dashboard/components/batch-lookup-card";
import { ProductTypeChart } from "@/modules/dashboard/components/product-type-chart";
import { RecordsTrendChart } from "@/modules/dashboard/components/records-trend-chart";
import { LiveClock } from "@/modules/dashboard/components/live-clock";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const data = await getDashboardData();
  const roleLabel = ROLE_LABELS[session.user.roleKey] ?? session.user.roleKey;
  const firstName = (session.user.name ?? session.user.email ?? "there").split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <FadeIn className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            <span className="text-border">·</span>
            <LiveClock />
          </p>
        </div>
        <Badge className="gap-1.5 border-primary/30 bg-primary/10 text-primary" variant="outline">
          <span className="size-1.5 rounded-full bg-primary" />
          {roleLabel} — {session.user.permissions.length} permissions
        </Badge>
      </FadeIn>

      <FadeIn delay={0.05}>
        <BatchLookupCard />
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FadeIn delay={0.1}>
          <StatTile label="Products" value={data.kpis.productCount} icon={Package} accent />
        </FadeIn>
        <FadeIn delay={0.15}>
          <StatTile label="Customers" value={data.kpis.customerCount} icon={UsersIcon} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <StatTile label="Active Users" value={data.kpis.activeUserCount} icon={UserCog} />
        </FadeIn>
        <FadeIn delay={0.25}>
          <StatTile
            label="Phase 1 modules live"
            value={`${data.buildProgress.built}/${data.buildProgress.total}`}
            icon={Rocket}
          />
        </FadeIn>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <FadeIn delay={0.3}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Products by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTypeChart data={data.productTypeChart} />
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.35}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">New Records — Last 14 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordsTrendChart data={data.activityChart} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <FadeIn delay={0.4}>
          <ProductionOverviewCard
            activeBatchCount={data.productionSummary.activeBatchCount}
            completedBatchCount={data.productionSummary.completedBatchCount}
          />
        </FadeIn>
        <FadeIn delay={0.45}>
          <InventorySummaryCard
            skuLocationCount={data.inventorySummary.skuLocationCount}
            totalUnitsOnHand={data.inventorySummary.totalUnitsOnHand}
          />
        </FadeIn>
        <FadeIn delay={0.5}>
          <QualitySummaryCard
            passRate={data.qualitySummary.passRate}
            passCount={data.qualitySummary.passCount}
            failCount={data.qualitySummary.failCount}
            pendingCount={data.qualitySummary.pendingCount}
          />
        </FadeIn>
      </div>

      <FadeIn delay={0.55}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline items={data.activity} />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
