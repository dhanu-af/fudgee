import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createReview } from "@/modules/storefront/actions";
import { getProductsForReviewPicker } from "@/modules/storefront/queries";
import { ReviewForm } from "@/modules/storefront/components/review-form";

export default async function NewReviewPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const products = await getProductsForReviewPicker();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New review</h1>
      <ReviewForm action={createReview} products={products} />
    </div>
  );
}
