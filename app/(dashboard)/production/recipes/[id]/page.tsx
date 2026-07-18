import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getRecipeById, getRawMaterialOptions } from "@/modules/recipes/queries";
import { updateRecipe, deleteRecipe } from "@/modules/recipes/actions";
import { RecipeForm } from "@/modules/recipes/components/recipe-form";
import { BatchCalculator } from "@/modules/recipes/components/batch-calculator";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const { id } = await params;
  const [recipe, rawMaterials] = await Promise.all([getRecipeById(id), getRawMaterialOptions()]);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{`${recipe.product.name} recipe`}</h1>
          {can(session, PERMISSIONS.SYSTEM_DELETE) && (
            <DeleteRowButton
              action={deleteRecipe.bind(null, id)}
              confirmMessage={`Delete the recipe for "${recipe.product.name}"? This cannot be undone.`}
            />
          )}
        </div>
        <RecipeForm
          action={updateRecipe.bind(null, id)}
          finishedGoods={[]}
          rawMaterials={rawMaterials.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
          recipe={recipe}
        />
      </div>

      <BatchCalculator
        recipeId={recipe.id}
        lines={recipe.lines.map((l) => ({
          productId: l.productId,
          productName: l.product.name,
          productSku: l.product.sku,
          quantityPerUnit: Number(l.quantityPerUnit),
          costPrice: l.product.costPrice != null ? Number(l.product.costPrice) : 0,
        }))}
        sellPrice={recipe.product.sellPrice != null ? Number(recipe.product.sellPrice) : null}
      />
    </div>
  );
}
