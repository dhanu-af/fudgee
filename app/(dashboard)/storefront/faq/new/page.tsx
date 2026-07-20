import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createFaqItem } from "@/modules/storefront/actions";
import { FaqForm } from "@/modules/storefront/components/faq-form";

export default async function NewFaqItemPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New FAQ question</h1>
      <FaqForm action={createFaqItem} />
    </div>
  );
}
