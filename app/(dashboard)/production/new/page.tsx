import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFinishedGoodOptions, getRawMaterialOptions } from "@/modules/production/queries";
import { getBatchCalculationById } from "@/modules/batch-calculations/queries";
import { ProductionBatchForm } from "@/modules/production/components/production-batch-form";

export default async function NewProductionBatchPage({
  searchParams,
}: {
  searchParams: Promise<{ calcId?: string }>;
}) {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const { calcId } = await searchParams;
  const [finishedGoods, rawMaterials] = await Promise.all([getFinishedGoodOptions(), getRawMaterialOptions()]);

  let initialProductId: string | undefined;
  let initialQuantityPlanned: string | undefined;
  let initialInputs: { productId: string; quantity: string }[] | undefined;

  if (calcId) {
    const calc = await getBatchCalculationById(calcId);
    if (calc) {
      initialProductId = calc.recipe.productId;
      initialQuantityPlanned = String(calc.requiredBatchSize);
      initialInputs = calc.lines.map((l) => ({
        productId: l.productId,
        quantity: String(l.roundedQty),
      }));
    }
  }

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
          initialProductId={initialProductId}
          initialQuantityPlanned={initialQuantityPlanned}
          initialInputs={initialInputs}
        />
      )}
    </div>
  );
}
