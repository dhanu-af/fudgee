import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getHeroImages } from "@/modules/storefront/queries";
import { heroImageColumns } from "@/modules/storefront/components/hero-image-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontHeroImagesPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const items = await getHeroImages();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/hero-images" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hero Images</h1>
        <Button render={<Link href="/storefront/hero-images/new" />}>New photo</Button>
      </div>
      <DataTable columns={heroImageColumns} data={items} emptyMessage="No hero photos yet." />
    </div>
  );
}
