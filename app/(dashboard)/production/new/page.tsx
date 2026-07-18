import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFinishedGoodOptions, getRawMaterialOptions } from "@/modules/production/queries";
import { ProductionBatchForm } from "@/modules/production/components/production-batch-form";

export default async function NewProductionBatchPage() {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const [finishedGoods, rawMaterials] = await Promise.all([getFinishedGoodOptions(), getRawMaterialOptions()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New production batch</h1>
      {finishedGoods.length === 0 || rawMaterials.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You need at least one active finished good and one active raw material/packaging product before
          creating a production batch.
        </p>
      ) : (
        <ProductionBatchForm
          finishedGoods={finishedGoods.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
          rawMaterials={rawMaterials.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
        />
      )}
    </div>
  );
}
