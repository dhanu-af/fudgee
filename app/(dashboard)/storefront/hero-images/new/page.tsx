import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createHeroImage } from "@/modules/storefront/actions";
import { HeroImageForm } from "@/modules/storefront/components/hero-image-form";

export default async function NewHeroImagePage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New hero photo</h1>
      <HeroImageForm action={createHeroImage} />
    </div>
  );
}
