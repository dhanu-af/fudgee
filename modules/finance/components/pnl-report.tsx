import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfitAndLoss } from "@/modules/finance/lib/pnl";

function Row({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span>{label}</span>
      <span className={value < 0 ? "text-destructive" : undefined}>{value.toFixed(2)}</span>
    </div>
  );
}

export function PnlReport({ data }: { data: ProfitAndLoss }) {
  return (
    <Card className="max-w-xl border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Profit &amp; Loss</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border/60 text-sm">
        {data.hasNullCost && (
          <p className="pb-2 text-xs text-amber-600 dark:text-amber-400">
            Some sales order lines in this range have no cost recorded — COGS and margin figures below may be
            understated. Set Cost Price on the affected products to fix this going forward.
          </p>
        )}
        <Row label="Revenue" value={data.revenue} />
        <Row label="Cost of Goods Sold" value={-data.cogs} />
        <Row label="Gross Profit" value={data.grossProfit} emphasis />
        <Row label="Expenses" value={-data.expenseCost} />
        <Row label="Freight" value={-data.freightCost} />
        <Row label="Depreciation" value={-data.depreciation} />
        <Row label="Net Profit" value={data.netProfit} emphasis />
      </CardContent>
    </Card>
  );
}
