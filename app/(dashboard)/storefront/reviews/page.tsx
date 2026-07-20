import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getReviews } from "@/modules/storefront/queries";
import { reviewColumns } from "@/modules/storefront/components/review-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontReviewsPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const reviews = await getReviews();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/reviews" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <Button render={<Link href="/storefront/reviews/new" />}>New review</Button>
      </div>
      <DataTable columns={reviewColumns} data={reviews} emptyMessage="No reviews yet." />
    </div>
  );
}
