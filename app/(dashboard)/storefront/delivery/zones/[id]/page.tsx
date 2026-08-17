import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getDeliveryZoneById } from "@/modules/storefront/queries";
import { updateDeliveryZone, deleteDeliveryZone } from "@/modules/storefront/actions";
import { DeliveryZoneForm } from "@/modules/storefront/components/delivery-zone-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditDeliveryZonePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const zone = await getDeliveryZoneById(id);
  if (!zone) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit delivery zone</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteDeliveryZone.bind(null, id)}
            confirmMessage="Delete this delivery zone? This cannot be undone."
          />
        )}
      </div>
      <DeliveryZoneForm action={updateDeliveryZone.bind(null, id)} zone={zone} />
    </div>
  );
}
