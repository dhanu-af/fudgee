import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getHeroImageById } from "@/modules/storefront/queries";
import { updateHeroImage, deleteHeroImage } from "@/modules/storefront/actions";
import { HeroImageForm } from "@/modules/storefront/components/hero-image-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditHeroImagePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const item = await getHeroImageById(id);
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit hero photo</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteHeroImage.bind(null, id)}
            confirmMessage="Delete this photo? This cannot be undone."
          />
        )}
      </div>
      <HeroImageForm action={updateHeroImage.bind(null, id)} item={item} />
    </div>
  );
}
