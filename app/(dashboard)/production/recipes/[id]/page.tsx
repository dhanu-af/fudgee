import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getRecipeById } from "@/modules/recipes/queries";
import { getBatchCalculations } from "@/modules/batch-calculations/queries";
import { deleteRecipe } from "@/modules/recipes/actions";
import { FormulationTable } from "@/modules/recipes/components/formulation-table";
import { batchCalculationColumns } from "@/modules/batch-calculations/components/batch-calculation-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { Button } from "@/components/ui/button";

export default async function RecipeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const { id } = await params;
  const [recipe, calculations] = await Promise.all([getRecipeById(id), getBatchCalculations(id)]);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Formulation Checker / {recipe.product.name}</p>
            <h1 className="text-xl font-semibold">{recipe.name || recipe.product.name}</h1>
          </div>
          <div className="flex gap-2">
            {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
              <Button variant="outline" render={<Link href={`/production/recipes/${id}/edit`} />}>
                Edit
              </Button>
            )}
            {can(session, PERMISSIONS.SYSTEM_DELETE) && (
              <DeleteRowButton
                action={deleteRecipe.bind(null, id)}
                confirmMessage={`Delete the recipe for "${recipe.product.name}"? This cannot be undone.`}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 p-4">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide">
            Master Formulation — Controlled Percentage Basis
          </p>
          <p className="mb-3 text-sm">
            <span className="text-muted-foreground">Base Batch Size: </span>
            <span className="font-medium">{recipe.baseBatchSize != null ? String(recipe.baseBatchSize) : "—"}</span>
          </p>
          <FormulationTable baseBatchSize={Number(recipe.baseBatchSize ?? 0)} lines={recipe.lines} />
        </div>

        {recipe.notes && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Notes</span>
            <p className="text-sm text-muted-foreground">{recipe.notes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Batch Calculator</h2>
          {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
            <Button render={<Link href={`/production/recipes/${id}/calculations/new`} />}>
              New batch calculation
            </Button>
          )}
        </div>
        <DataTable
          columns={batchCalculationColumns}
          data={calculations}
          emptyMessage="No batch calculations recorded yet."
        />
      </div>
    </div>
  );
}
