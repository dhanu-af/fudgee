import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getGalleryItems } from "@/modules/storefront/queries";
import { galleryColumns } from "@/modules/storefront/components/gallery-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontGalleryPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const items = await getGalleryItems();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/gallery" tabs={STOREFRONT_TABS} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gallery</h1>
        <Button render={<Link href="/storefront/gallery/new" />}>New photo</Button>
      </div>
      <DataTable columns={galleryColumns} data={items} emptyMessage="No gallery photos yet." />
    </div>
  );
}
