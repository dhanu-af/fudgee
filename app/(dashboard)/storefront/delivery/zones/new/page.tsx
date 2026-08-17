import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createDeliveryZone } from "@/modules/storefront/actions";
import { DeliveryZoneForm } from "@/modules/storefront/components/delivery-zone-form";

export default async function NewDeliveryZonePage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New delivery zone</h1>
      <DeliveryZoneForm action={createDeliveryZone} />
    </div>
  );
}
