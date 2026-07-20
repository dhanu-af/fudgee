import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getFaqItems } from "@/modules/storefront/queries";
import { faqColumns } from "@/modules/storefront/components/faq-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontFaqPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const faqItems = await getFaqItems();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/faq" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">FAQ</h1>
        <Button render={<Link href="/storefront/faq/new" />}>New question</Button>
      </div>
      <DataTable columns={faqColumns} data={faqItems} emptyMessage="No FAQ items yet." />
    </div>
  );
}
