import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createCategory } from "@/modules/storefront/actions";
import { CategoryForm } from "@/modules/storefront/components/category-form";

export default async function NewCategoryPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New category</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
