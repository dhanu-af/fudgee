import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createGalleryItem } from "@/modules/storefront/actions";
import { GalleryForm } from "@/modules/storefront/components/gallery-form";

export default async function NewGalleryItemPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New gallery photo</h1>
      <GalleryForm action={createGalleryItem} />
    </div>
  );
}
