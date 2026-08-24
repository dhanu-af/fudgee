import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createNewsItem } from "@/modules/storefront/actions";
import { NewsForm } from "@/modules/storefront/components/news-form";

export default async function NewNewsItemPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New announcement</h1>
      <NewsForm action={createNewsItem} />
    </div>
  );
}
