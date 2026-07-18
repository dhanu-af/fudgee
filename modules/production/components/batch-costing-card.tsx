import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { computeBatchCosting } from "@/modules/production/lib/batch-costing";

type InputLine = {
  id: string;
  quantity: unknown;
  product: { name: string; sku: string; costPrice: unknown };
};

export function BatchCostingCard({
  inputs,
  quantityActual,
  quantityWaste,
  sellPrice,
}: {
  inputs: InputLine[];
  quantityActual: number;
  quantityWaste: number | null;
  sellPrice: number | null;
}) {
  const lines = inputs.map((input) => {
    const qty = Number(input.quantity);
    const unitCost = Number(input.product.costPrice ?? 0);
    return { ...input, qty, unitCost, lineCost: qty * unitCost };
  });
  const { totalRawMaterialCost, avgCostPerUnit, profitPerUnit, totalProfit } = computeBatchCosting(
    inputs,
    quantityActual,
    sellPrice
  );

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Batch costing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raw material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit cost</TableHead>
              <TableHead>Line cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{`${line.product.name} (${line.product.sku})`}</TableCell>
                <TableCell>{line.qty}</TableCell>
                <TableCell>{line.unitCost.toFixed(2)}</TableCell>
                <TableCell>{line.lineCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total raw material cost</span>
            <span className="font-medium">{totalRawMaterialCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Good quantity produced</span>
            <span>{quantityActual}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Waste / rejects</span>
            <span>{quantityWaste ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. cost per unit</span>
            <span className="font-medium">{avgCostPerUnit !== null ? avgCostPerUnit.toFixed(2) : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sell price per unit</span>
            <span>{sellPrice !== null ? sellPrice.toFixed(2) : "not set"}</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-1 font-medium">
            <span>Profit per unit</span>
            <span>{profitPerUnit !== null ? profitPerUnit.toFixed(2) : "—"}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total batch profit</span>
            <span>{totalProfit !== null ? totalProfit.toFixed(2) : "—"}</span>
          </div>
        </div>
        {sellPrice === null && (
          <p className="text-xs text-muted-foreground">
            Set a sell price on this product to see profit — edit it from the Products page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
