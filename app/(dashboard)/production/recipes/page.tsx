import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getRecipes } from "@/modules/recipes/queries";
import { recipeColumns } from "@/modules/recipes/components/recipe-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";

export default async function RecipesPage() {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_READ);
  const recipes = await getRecipes();

  return (
    <div className="flex flex-col gap-4">
      <TabNav
        active="/production/recipes"
        tabs={[
          { label: "Batches", href: "/production" },
          { label: "Recipes", href: "/production/recipes" },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Recipes</h1>
        {can(session, PERMISSIONS.PRODUCTION_WRITE) && (
          <Button render={<Link href="/production/recipes/new" />}>New recipe</Button>
        )}
      </div>
      <DataTable columns={recipeColumns} data={recipes} emptyMessage="No recipes yet." />
    </div>
  );
}
