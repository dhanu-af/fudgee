import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getRecipeById, getRawMaterialOptions } from "@/modules/recipes/queries";
import { updateRecipe } from "@/modules/recipes/actions";
import { RecipeForm } from "@/modules/recipes/components/recipe-form";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const { id } = await params;
  const [recipe, rawMaterials] = await Promise.all([getRecipeById(id), getRawMaterialOptions()]);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{`Edit ${recipe.product.name} recipe`}</h1>
      <RecipeForm
        action={updateRecipe.bind(null, id)}
        finishedGoods={[]}
        rawMaterials={rawMaterials.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
        recipe={recipe}
      />
    </div>
  );
}
