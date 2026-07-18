import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getLocationById } from "@/modules/warehouse/queries";
import { updateLocation } from "@/modules/warehouse/actions";
import { LocationForm } from "@/modules/warehouse/components/location-form";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.WAREHOUSE_WRITE);
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit location</h1>
      <LocationForm action={updateLocation.bind(null, id)} location={location} />
    </div>
  );
}
