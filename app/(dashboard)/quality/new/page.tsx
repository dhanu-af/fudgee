import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCheckableBatchOptions } from "@/modules/quality/queries";
import { QualityCheckForm } from "@/modules/quality/components/quality-check-form";

export default async function NewQualityCheckPage() {
  await requirePermission(PERMISSIONS.QUALITY_WRITE);
  const batches = await getCheckableBatchOptions();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Record quality check</h1>
      {batches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No batches are in progress or completed yet — start or complete a production batch before recording a
          quality check.
        </p>
      ) : (
        <QualityCheckForm
          batches={batches.map((b) => ({
            id: b.id,
            label: `BATCH-${String(b.seq).padStart(4, "0")} — ${b.product.name} (${b.product.sku})`,
          }))}
        />
      )}
    </div>
  );
}
