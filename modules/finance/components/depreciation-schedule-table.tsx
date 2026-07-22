import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DepreciationScheduleTable({
  rows,
}: {
  rows: { month: number; date: Date; accumulated: number; bookValue: number }[];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No depreciation recognized yet — the purchase date hasn&apos;t reached its first full month.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>As of</TableHead>
          <TableHead>Accumulated Depreciation</TableHead>
          <TableHead>Book Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.month}>
            <TableCell>{row.month}</TableCell>
            <TableCell>{row.date.toLocaleDateString()}</TableCell>
            <TableCell>{row.accumulated.toFixed(2)}</TableCell>
            <TableCell>{row.bookValue.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
