import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getNewsletterSignups } from "@/modules/storefront/queries";
import { newsletterColumns } from "@/modules/storefront/components/newsletter-columns";
import { DataTable } from "@/components/data-table/data-table";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontNewsletterPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const signups = await getNewsletterSignups();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/newsletter" tabs={STOREFRONT_TABS} />
      <h1 className="text-xl font-semibold">Newsletter signups</h1>
      <DataTable columns={newsletterColumns} data={signups} emptyMessage="No signups yet." />
    </div>
  );
}
