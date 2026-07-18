import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getReportsData } from "@/modules/reports/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_READ);
  const data = await getReportsData();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Reports</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">{data.salesOrders.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">total value across all orders</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {data.salesOrders.byStatus.map((s) => (
                <Badge key={s.status} variant="secondary">
                  {s.status}: {s.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">{data.purchaseOrders.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">total value across all orders</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {data.purchaseOrders.byStatus.map((s) => (
                <Badge key={s.status} variant="secondary">
                  {s.status}: {s.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">{data.inventoryValuation.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">on-hand stock × cost price</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Production Output</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">
              {data.production.byStatus.find((s) => s.status === "COMPLETED")?.totalActual.toFixed(2) ?? "0.00"}
            </p>
            <p className="text-xs text-muted-foreground">units produced (completed batches)</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {data.production.byStatus.map((s) => (
                <Badge key={s.status} variant="secondary">
                  {s.status}: {s.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quality Control</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {data.quality.byResult.length === 0 ? (
                <p className="text-xs text-muted-foreground">No checks recorded yet.</p>
              ) : (
                data.quality.byResult.map((r) => (
                  <Badge key={r.result} variant="secondary">
                    {r.result}: {r.count}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
