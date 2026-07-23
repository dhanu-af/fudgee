import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getPromotionById } from "@/modules/storefront/queries";
import { updatePromotion, deletePromotion } from "@/modules/storefront/actions";
import { PromotionForm } from "@/modules/storefront/components/promotion-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const promotion = await getPromotionById(id);
  if (!promotion) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit promotion</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deletePromotion.bind(null, id)}
            confirmMessage="Delete this promotion? This cannot be undone."
          />
        )}
      </div>
      <PromotionForm action={updatePromotion.bind(null, id)} promotion={promotion} />
    </div>
  );
}
