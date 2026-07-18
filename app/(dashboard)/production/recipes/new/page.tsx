import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFinishedGoodOptionsWithoutRecipe, getRawMaterialOptions } from "@/modules/recipes/queries";
import { createRecipe } from "@/modules/recipes/actions";
import { RecipeForm } from "@/modules/recipes/components/recipe-form";

export default async function NewRecipePage() {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const [finishedGoods, rawMaterials] = await Promise.all([
    getFinishedGoodOptionsWithoutRecipe(),
    getRawMaterialOptions(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New recipe</h1>
      {finishedGoods.length === 0 || rawMaterials.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You need a finished good without a recipe yet, and at least one active raw material/packaging product.
        </p>
      ) : (
        <RecipeForm
          action={createRecipe}
          finishedGoods={finishedGoods.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
          rawMaterials={rawMaterials.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
        />
      )}
    </div>
  );
}
