import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getGalleryItemById } from "@/modules/storefront/queries";
import { updateGalleryItem, deleteGalleryItem } from "@/modules/storefront/actions";
import { GalleryForm } from "@/modules/storefront/components/gallery-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const item = await getGalleryItemById(id);
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit gallery photo</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteGalleryItem.bind(null, id)}
            confirmMessage="Delete this photo? This cannot be undone."
          />
        )}
      </div>
      <GalleryForm action={updateGalleryItem.bind(null, id)} item={item} />
    </div>
  );
}
