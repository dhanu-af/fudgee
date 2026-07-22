import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CustomerProfitability } from "@/modules/finance/lib/pnl";

export function CustomerProfitabilityTable({ data }: { data: CustomerProfitability[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No revenue-recognized sales orders in this date range.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>COGS</TableHead>
          <TableHead>Gross Profit</TableHead>
          <TableHead>Margin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.customerId}>
            <TableCell className="font-medium">{row.customerName}</TableCell>
            <TableCell>{row.revenue.toFixed(2)}</TableCell>
            <TableCell>{row.cogs.toFixed(2)}</TableCell>
            <TableCell>{row.grossProfit.toFixed(2)}</TableCell>
            <TableCell>{row.revenue > 0 ? `${((row.grossProfit / row.revenue) * 100).toFixed(1)}%` : "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
