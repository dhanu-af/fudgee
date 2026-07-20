import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getFaqItemById } from "@/modules/storefront/queries";
import { updateFaqItem, deleteFaqItem } from "@/modules/storefront/actions";
import { FaqForm } from "@/modules/storefront/components/faq-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditFaqItemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const faqItem = await getFaqItemById(id);
  if (!faqItem) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit FAQ question</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteFaqItem.bind(null, id)}
            confirmMessage="Delete this FAQ item? This cannot be undone."
          />
        )}
      </div>
      <FaqForm action={updateFaqItem.bind(null, id)} faqItem={faqItem} />
    </div>
  );
}
