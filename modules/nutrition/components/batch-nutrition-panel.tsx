import { NUTRIENT_FIELDS, type NutrientKey, type OtherNutrient } from "@/modules/nutrition/lib/nutrients";
import { BatchNutrientRow } from "@/modules/nutrition/components/batch-nutrient-row";
import { RecalculateButton } from "@/modules/nutrition/components/recalculate-button";
import { PrintPanelButton } from "@/modules/nutrition/components/print-panel-button";
import { NutritionAuditLog } from "@/modules/nutrition/components/nutrition-audit-log";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type BatchNutritionData = {
  id: string;
  servingSizeGrams: unknown;
  otherNutrients: unknown;
  isLocked: boolean;
  lockedAt: Date | null;
  lockedByUser: { name: string } | null;
  auditLogs: {
    id: string;
    field: string;
    oldValue: string | null;
    newValue: string | null;
    reason: string | null;
    changedAt: Date;
    changedByUser: { name: string } | null;
  }[];
} & Partial<Record<NutrientKey, unknown>>;

function toNum(v: unknown): number | null {
  return v === null || v === undefined ? null : Number(v);
}

export function BatchNutritionPanel({
  batchNutrition,
  canWrite,
}: {
  batchNutrition: BatchNutritionData;
  canWrite: boolean;
}) {
  const servingSizeGrams = toNum(batchNutrition.servingSizeGrams);
  const scale = servingSizeGrams !== null ? servingSizeGrams / 100 : null;
  const otherNutrients: OtherNutrient[] = Array.isArray(batchNutrition.otherNutrients)
    ? (batchNutrition.otherNutrients as OtherNutrient[])
    : [];
  const editable = canWrite && !batchNutrition.isLocked;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {batchNutrition.isLocked ? (
            <Badge>
              Locked{batchNutrition.lockedAt ? ` ${new Date(batchNutrition.lockedAt).toLocaleDateString()}` : ""}
              {batchNutrition.lockedByUser ? ` by ${batchNutrition.lockedByUser.name}` : ""}
            </Badge>
          ) : (
            <Badge variant="secondary">Not locked — editable</Badge>
          )}
        </div>
        <div className="flex gap-2 print:hidden">
          {editable && <RecalculateButton batchNutritionId={batchNutrition.id} />}
          <PrintPanelButton />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nutrient</TableHead>
            <TableHead>Per 100g</TableHead>
            <TableHead>Per serving</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <BatchNutrientRow
            batchNutritionId={batchNutrition.id}
            field="servingSizeGrams"
            label="Serving size"
            unit="g"
            per100g={servingSizeGrams}
            perServing={null}
            editable={editable}
          />
          {NUTRIENT_FIELDS.map((field) => {
            const per100g = toNum(batchNutrition[field.key]);
            const perServing = per100g !== null && scale !== null ? Math.round(per100g * scale * 1000) / 1000 : null;
            return (
              <BatchNutrientRow
                key={field.key}
                batchNutritionId={batchNutrition.id}
                field={field.key}
                label={field.label}
                unit={field.unit}
                per100g={per100g}
                perServing={perServing}
                editable={editable}
              />
            );
          })}
        </TableBody>
      </Table>

      {otherNutrients.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Other nutrients</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutrient</TableHead>
                <TableHead>Per 100g</TableHead>
                <TableHead>Per serving</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherNutrients.map((n) => (
                <TableRow key={n.name}>
                  <TableCell>
                    {n.name} ({n.unit})
                  </TableCell>
                  <TableCell>{n.value}</TableCell>
                  <TableCell>{scale !== null ? Math.round(n.value * scale * 1000) / 1000 : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-1 text-xs text-muted-foreground">
            Calculated from the recipe only — use &quot;Recalculate from Recipe&quot; to refresh these, not editable
            directly.
          </p>
        </div>
      )}

      <div className="print:hidden">
        <h3 className="mb-2 text-sm font-medium">Change history</h3>
        <NutritionAuditLog entries={batchNutrition.auditLogs} />
      </div>
    </div>
  );
}
