import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createCarrier } from "@/modules/shipping/actions";
import { CarrierForm } from "@/modules/shipping/components/carrier-form";

export default async function NewCarrierPage() {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New carrier</h1>
      <CarrierForm action={createCarrier} />
    </div>
  );
}
