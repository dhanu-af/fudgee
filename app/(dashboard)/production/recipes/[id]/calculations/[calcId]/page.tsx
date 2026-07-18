import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getBatchCalculationById } from "@/modules/batch-calculations/queries";
import { deleteBatchCalculation } from "@/modules/batch-calculations/actions";
import { ActualDispensedCell } from "@/modules/batch-calculations/components/actual-dispensed-cell";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function BatchCalculationDetailPage({
  params,
}: {
  params: Promise<{ id: string; calcId: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const { id, calcId } = await params;
  const calc = await getBatchCalculationById(calcId);
  if (!calc || calc.recipeId !== id) notFound();

  const totalCost = calc.lines.reduce(
    (sum, l) => sum + Number(l.roundedQty) * (l.product.costPrice != null ? Number(l.product.costPrice) : 0),
    0
  );
  const requiredBatchSize = Number(calc.requiredBatchSize);
  const costPerUnit = requiredBatchSize > 0 ? totalCost / requiredBatchSize : 0;
  const sellPrice = calc.recipe.product.sellPrice != null ? Number(calc.recipe.product.sellPrice) : null;
  const profitPerUnit = sellPrice !== null ? sellPrice - costPerUnit : null;
  const totalProfit = profitPerUnit !== null ? profitPerUnit * requiredBatchSize : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{calc.recipe.product.name}</p>
          <h1 className="text-xl font-semibold">
            {calc.batchNumber || `CALC-${String(calc.seq).padStart(4, "0")}`}
          </h1>
        </div>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteBatchCalculation.bind(null, calc.id, id)}
            confirmMessage="Delete this batch calculation? This cannot be undone."
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Required batch size</p>
          <p className="font-medium">{String(calc.requiredBatchSize)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Entered by</p>
          <p className="font-medium">{calc.enteredBy ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Checked by</p>
          <p className="font-medium">{calc.checkedBy ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Calculation date</p>
          <p className="font-medium">{new Date(calc.calculationDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Ingredient</TableHead>
              <TableHead>Controlled % w/w</TableHead>
              <TableHead>Calculated Qty</TableHead>
              <TableHead>Rounded Qty</TableHead>
              <TableHead>Tolerance %</TableHead>
              <TableHead>Min Qty</TableHead>
              <TableHead>Max Qty</TableHead>
              <TableHead>Actual Dispensed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calc.lines.map((line, index) => (
              <TableRow key={line.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${line.product.name} (${line.product.sku})`}</TableCell>
                <TableCell>{Number(line.percentage).toFixed(4)}%</TableCell>
                <TableCell>{Number(line.calculatedQty).toFixed(3)}</TableCell>
                <TableCell>{Number(line.roundedQty).toFixed(2)}</TableCell>
                <TableCell>{Number(calc.tolerancePercent).toFixed(2)}%</TableCell>
                <TableCell>{Number(line.minQty).toFixed(3)}</TableCell>
                <TableCell>{Number(line.maxQty).toFixed(3)}</TableCell>
                <TableCell>
                  {can(session, PERMISSIONS.PRODUCTION_WRITE) ? (
                    <ActualDispensedCell
                      lineId={line.id}
                      recipeId={id}
                      initialValue={line.actualDispensed != null ? Number(line.actualDispensed) : null}
                    />
                  ) : line.actualDispensed != null ? (
                    Number(line.actualDispensed).toFixed(3)
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total raw material cost</span>
          <span className="font-medium">{totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cost per unit</span>
          <span>{costPerUnit.toFixed(2)}</span>
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

      {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
        <Button render={<Link href={`/production/new?calcId=${calc.id}`} />} className="w-fit">
          Create production batch from this calculation
        </Button>
      )}
    </div>
  );
}
