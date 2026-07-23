import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createPromotion } from "@/modules/storefront/actions";
import { PromotionForm } from "@/modules/storefront/components/promotion-form";

export default async function NewPromotionPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New promotion</h1>
      <PromotionForm action={createPromotion} />
    </div>
  );
}
