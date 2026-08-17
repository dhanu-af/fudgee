import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createDeliveryFreeRule } from "@/modules/storefront/actions";
import { DeliveryFreeRuleForm } from "@/modules/storefront/components/delivery-free-rule-form";

export default async function NewDeliveryFreeRulePage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New free-delivery rule</h1>
      <DeliveryFreeRuleForm action={createDeliveryFreeRule} />
    </div>
  );
}
