import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getDeliveryZones } from "@/modules/storefront/queries";
import { createDeliverySuburbOverride } from "@/modules/storefront/actions";
import { DeliverySuburbOverrideForm } from "@/modules/storefront/components/delivery-suburb-override-form";

export default async function NewDeliverySuburbOverridePage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const zones = await getDeliveryZones();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New suburb/postcode override</h1>
      <DeliverySuburbOverrideForm action={createDeliverySuburbOverride} zones={zones} />
    </div>
  );
}
