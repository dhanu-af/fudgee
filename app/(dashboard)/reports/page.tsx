import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getReportsData } from "@/modules/reports/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Batch Costing</h2>
        {data.batchCosting.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed batches yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Produced</TableHead>
                <TableHead>Waste</TableHead>
                <TableHead>Raw material cost</TableHead>
                <TableHead>Avg. cost/unit</TableHead>
                <TableHead>Profit/unit</TableHead>
                <TableHead>Total profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.batchCosting.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <Link href={`/production/${batch.id}`} className="font-medium hover:underline">
                      {`BATCH-${String(batch.seq).padStart(4, "0")}`}
                    </Link>
                  </TableCell>
                  <TableCell>{`${batch.productName} (${batch.productSku})`}</TableCell>
                  <TableCell>{batch.quantityActual}</TableCell>
                  <TableCell>{batch.quantityWaste}</TableCell>
                  <TableCell>{batch.totalRawMaterialCost.toFixed(2)}</TableCell>
                  <TableCell>{batch.avgCostPerUnit !== null ? batch.avgCostPerUnit.toFixed(2) : "—"}</TableCell>
                  <TableCell>{batch.profitPerUnit !== null ? batch.profitPerUnit.toFixed(2) : "—"}</TableCell>
                  <TableCell>{batch.totalProfit !== null ? batch.totalProfit.toFixed(2) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
