import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getProductionBatchById } from "@/modules/production/queries";
import { getOrInitBatchNutrition } from "@/modules/nutrition/queries";
import { BatchNutritionPanel } from "@/modules/nutrition/components/batch-nutrition-panel";
import { Badge } from "@/components/ui/badge";
import { TabNav } from "@/components/layout/tab-nav";

export default async function ProductionBatchNutritionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const { id } = await params;
  const batch = await getProductionBatchById(id);
  if (!batch) notFound();

  const batchNutrition = await getOrInitBatchNutrition(id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-semibold">{`BATCH-${String(batch.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">
            {batch.product.name} ({batch.product.sku})
          </p>
        </div>
        <Badge>{batch.status}</Badge>
      </div>

      <div className="print:hidden">
        <TabNav
          active={`/production/${id}/nutrition`}
          tabs={[
            { label: "Overview", href: `/production/${id}` },
            { label: "Nutrition", href: `/production/${id}/nutrition` },
          ]}
        />
      </div>

      <h2 className="hidden text-lg font-semibold print:block">
        Nutrition Information Panel — {batch.product.name} (BATCH-{String(batch.seq).padStart(4, "0")})
      </h2>

      {!batchNutrition ? (
        <p className="text-sm text-muted-foreground">
          This product has no Recipe yet — add one under Production &gt; Recipes before nutrition can be calculated
          for this batch.
        </p>
      ) : (
        <BatchNutritionPanel batchNutrition={batchNutrition} canWrite={can(session, PERMISSIONS.PRODUCTION_WRITE)} />
      )}
    </div>
  );
}
