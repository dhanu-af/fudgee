import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getReviewById } from "@/modules/storefront/queries";
import { updateReview, deleteReview } from "@/modules/storefront/actions";
import { ReviewForm } from "@/modules/storefront/components/review-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit review</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteReview.bind(null, id)}
            confirmMessage={`Delete this review from "${review.customerName}"? This cannot be undone.`}
          />
        )}
      </div>
      <ReviewForm action={updateReview.bind(null, id)} review={review} />
    </div>
  );
}
