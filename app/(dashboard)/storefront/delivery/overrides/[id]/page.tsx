import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getDeliverySuburbOverrideById, getDeliveryZones } from "@/modules/storefront/queries";
import { updateDeliverySuburbOverride, deleteDeliverySuburbOverride } from "@/modules/storefront/actions";
import { DeliverySuburbOverrideForm } from "@/modules/storefront/components/delivery-suburb-override-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditDeliverySuburbOverridePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const { id } = await params;
  const [override, zones] = await Promise.all([getDeliverySuburbOverrideById(id), getDeliveryZones()]);
  if (!override) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit suburb/postcode override</h1>
        {can(session, PERMISSIONS.STOREFRONT_DELETE) && (
          <DeleteRowButton
            action={deleteDeliverySuburbOverride.bind(null, id)}
            confirmMessage="Delete this override? This cannot be undone."
          />
        )}
      </div>
      <DeliverySuburbOverrideForm action={updateDeliverySuburbOverride.bind(null, id)} override={override} zones={zones} />
    </div>
  );
}
