import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function GstSummaryTable({
  data,
}: {
  data: { quarter: string; collected: number; paid: number; netPayable: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No GST-tracked sales orders or expenses yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quarter</TableHead>
          <TableHead>GST Collected</TableHead>
          <TableHead>GST Paid (est.)</TableHead>
          <TableHead>Net Payable (est.)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.quarter}>
            <TableCell className="font-medium">{row.quarter}</TableCell>
            <TableCell>{row.collected.toFixed(2)}</TableCell>
            <TableCell>{row.paid.toFixed(2)}</TableCell>
            <TableCell>{row.netPayable.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
