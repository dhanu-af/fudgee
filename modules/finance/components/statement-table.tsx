import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { StatementEntryWithBalance } from "@/modules/finance/lib/statement";

export function StatementTable({ rows, openingBalance }: { rows: StatementEntryWithBalance[]; openingBalance: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-muted-foreground">
            Opening balance
          </TableCell>
          <TableCell>{openingBalance.toFixed(2)}</TableCell>
        </TableRow>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
              No transactions in this date range.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.date.toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={row.isCash ? "default" : "secondary"}>{row.type.replace(/_/g, " ")}</Badge>
              </TableCell>
              <TableCell>{row.reference}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.debit > 0 ? row.debit.toFixed(2) : "—"}</TableCell>
              <TableCell>{row.credit > 0 ? row.credit.toFixed(2) : "—"}</TableCell>
              <TableCell>{row.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
