import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Line = {
  id: string;
  product: { sku: string; name: string };
  uin: string | null;
  percentage: unknown;
  controlStatus: string;
  changeControlRef: string | null;
  approvedBy: string | null;
};

export function FormulationTable({ baseBatchSize, lines }: { baseBatchSize: number; lines: Line[] }) {
  const totalPercentage = lines.reduce((sum, l) => sum + Number(l.percentage ?? 0), 0);
  const totalBaseQty = lines.reduce((sum, l) => sum + (Number(l.percentage ?? 0) / 100) * baseBatchSize, 0);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>RM Number</TableHead>
            <TableHead>Ingredient / AAN</TableHead>
            <TableHead>UIN</TableHead>
            <TableHead>Base Qty</TableHead>
            <TableHead>% w/w</TableHead>
            <TableHead>Control Status</TableHead>
            <TableHead>Change Control Ref</TableHead>
            <TableHead>Approved By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => {
            const pct = Number(line.percentage ?? 0);
            const baseQty = (pct / 100) * baseBatchSize;
            return (
              <TableRow key={line.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{line.product.sku}</TableCell>
                <TableCell>{line.product.name}</TableCell>
                <TableCell>{line.uin ?? "—"}</TableCell>
                <TableCell>{baseQty.toFixed(3)}</TableCell>
                <TableCell>{pct.toFixed(4)}%</TableCell>
                <TableCell>
                  <Badge variant={line.controlStatus === "APPROVED" ? "default" : "secondary"}>
                    {line.controlStatus}
                  </Badge>
                </TableCell>
                <TableCell>{line.changeControlRef ?? "—"}</TableCell>
                <TableCell>{line.approvedBy ?? "—"}</TableCell>
              </TableRow>
            );
          })}
          <TableRow className="font-medium">
            <TableCell colSpan={4}>TOTAL</TableCell>
            <TableCell>{totalBaseQty.toFixed(3)}</TableCell>
            <TableCell>{totalPercentage.toFixed(4)}%</TableCell>
            <TableCell colSpan={3} />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
