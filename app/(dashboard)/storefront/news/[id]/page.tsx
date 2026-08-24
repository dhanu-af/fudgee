import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getNewsItemById } from "@/modules/storefront/queries";
import { updateNewsItem, deleteNewsItem } from "@/modules/storefront/actions";
import { NewsForm } from "@/modules/storefront/components/news-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditNewsItemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const newsItem = await getNewsItemById(id);
  if (!newsItem) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit announcement</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteNewsItem.bind(null, id)}
            confirmMessage="Delete this announcement? This cannot be undone."
          />
        )}
      </div>
      <NewsForm action={updateNewsItem.bind(null, id)} newsItem={newsItem} />
    </div>
  );
}
