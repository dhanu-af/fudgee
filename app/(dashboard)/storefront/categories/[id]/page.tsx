import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCategoryById } from "@/modules/storefront/queries";
import { updateCategory, deleteCategory } from "@/modules/storefront/actions";
import { CategoryForm } from "@/modules/storefront/components/category-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit category</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteCategory.bind(null, id)}
            confirmMessage={`Delete "${category.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <CategoryForm action={updateCategory.bind(null, id)} category={category} />
    </div>
  );
}
