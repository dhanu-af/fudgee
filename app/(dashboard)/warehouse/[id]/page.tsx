import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getLocationById } from "@/modules/warehouse/queries";
import { updateLocation, deleteLocation } from "@/modules/warehouse/actions";
import { LocationForm } from "@/modules/warehouse/components/location-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.WAREHOUSE_WRITE);
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit location</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteLocation.bind(null, id)}
            confirmMessage={`Delete "${location.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <LocationForm action={updateLocation.bind(null, id)} location={location} />
    </div>
  );
}
