import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getShippingReportData } from "@/modules/shipping/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabNav } from "@/components/layout/tab-nav";
import { SHIPPING_TABS } from "@/modules/shipping/nav";

export default async function ShippingReportsPage() {
  await requirePermission(PERMISSIONS.SHIPPING_READ);
  const data = await getShippingReportData();

  return (
    <div className="flex flex-col gap-6">
      <TabNav active="/shipping/reports" tabs={SHIPPING_TABS} />
      <h1 className="text-xl font-semibold">Shipping Reports</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Shipped Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.ordersShippedToday}</p>
            <p className="text-xs text-muted-foreground">shipments dispatched today</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Delayed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.ordersDelayed}</p>
            <p className="text-xs text-muted-foreground">past their required ship date, not yet delivered</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Freight Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.totalFreightCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">total across all shipments</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {data.avgShippingHours !== null ? `${(data.avgShippingHours / 24).toFixed(1)}d` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              avg. time from dispatch to delivered ({data.deliveredCount} delivered)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.returnRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">{data.returnCount} returns recorded</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Carrier Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data.carrierPerformance.length === 0 ? (
              <p className="text-xs text-muted-foreground">No carrier-assigned shipments yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {data.carrierPerformance.map((c) => (
                  <Badge key={c.name} variant="secondary">
                    {c.name}: {c.delivered}/{c.count} delivered
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
