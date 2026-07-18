import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getRecipeById } from "@/modules/recipes/queries";
import { BatchCalculationForm } from "@/modules/batch-calculations/components/batch-calculation-form";

export default async function NewBatchCalculationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{`New batch calculation — ${recipe.product.name}`}</h1>
      <BatchCalculationForm recipeId={id} defaultEnteredBy={session.user.name ?? undefined} />
    </div>
  );
}
