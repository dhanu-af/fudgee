import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getDeliveryFreeRuleById } from "@/modules/storefront/queries";
import { updateDeliveryFreeRule, deleteDeliveryFreeRule } from "@/modules/storefront/actions";
import { DeliveryFreeRuleForm } from "@/modules/storefront/components/delivery-free-rule-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditDeliveryFreeRulePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const rule = await getDeliveryFreeRuleById(id);
  if (!rule) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit free-delivery rule</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteDeliveryFreeRule.bind(null, id)}
            confirmMessage="Delete this free-delivery rule? This cannot be undone."
          />
        )}
      </div>
      <DeliveryFreeRuleForm action={updateDeliveryFreeRule.bind(null, id)} rule={rule} />
    </div>
  );
}
