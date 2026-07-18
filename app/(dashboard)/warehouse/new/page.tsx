import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createLocation } from "@/modules/warehouse/actions";
import { LocationForm } from "@/modules/warehouse/components/location-form";

export default async function NewLocationPage() {
  await requirePermission(PERMISSIONS.WAREHOUSE_WRITE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New location</h1>
      <LocationForm action={createLocation} />
    </div>
  );
}
