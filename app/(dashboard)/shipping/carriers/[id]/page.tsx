import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCarrierById } from "@/modules/shipping/queries";
import { updateCarrier, deleteCarrier } from "@/modules/shipping/actions";
import { CarrierForm } from "@/modules/shipping/components/carrier-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditCarrierPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.SHIPPING_WRITE);
  const { id } = await params;
  const carrier = await getCarrierById(id);
  if (!carrier) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit carrier</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteCarrier.bind(null, id)}
            confirmMessage={`Delete "${carrier.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <CarrierForm action={updateCarrier.bind(null, id)} carrier={carrier} />
    </div>
  );
}
