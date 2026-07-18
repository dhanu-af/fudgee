import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getProductionBatchById } from "@/modules/production/queries";
import { ProductionBatchStatusActions } from "@/modules/production/components/production-batch-status-actions";
import { BatchCostingCard } from "@/modules/production/components/batch-costing-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProductionBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const { id } = await params;
  const batch = await getProductionBatchById(id);
  if (!batch) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`BATCH-${String(batch.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">
            {batch.product.name} ({batch.product.sku})
          </p>
        </div>
        <Badge>{batch.status}</Badge>
      </div>

      {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
        <ProductionBatchStatusActions
          id={batch.id}
          status={batch.status}
          quantityPlanned={Number(batch.quantityPlanned)}
        />
      )}

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Planned quantity</span>
          <span>{String(batch.quantityPlanned)}</span>
        </div>
      </div>

      {batch.quantityActual != null && (
        <BatchCostingCard
          inputs={batch.inputs}
          quantityActual={Number(batch.quantityActual)}
          quantityWaste={batch.quantityWaste != null ? Number(batch.quantityWaste) : null}
          sellPrice={batch.product.sellPrice != null ? Number(batch.product.sellPrice) : null}
        />
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Raw material inputs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raw material</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batch.inputs.map((input) => (
              <TableRow key={input.id}>
                <TableCell>{`${input.product.name} (${input.product.sku})`}</TableCell>
                <TableCell>{String(input.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Quality checks</h2>
        {batch.qualityChecks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No quality checks recorded yet — record one from the Quality Control page.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Result</TableHead>
                <TableHead>Checked at</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.qualityChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>
                    <Badge
                      variant={
                        check.result === "PASS" ? "default" : check.result === "FAIL" ? "destructive" : "secondary"
                      }
                    >
                      {check.result}
                    </Badge>
                  </TableCell>
                  <TableCell>{check.checkedAt ? new Date(check.checkedAt).toLocaleString() : "—"}</TableCell>
                  <TableCell>{check.notes ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {batch.notes && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Notes</span>
          <p className="text-sm text-muted-foreground">{batch.notes}</p>
        </div>
      )}
    </div>
  );
}
