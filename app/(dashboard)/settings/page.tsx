import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getOrganization } from "@/modules/settings/queries";
import { SettingsForm } from "@/modules/settings/components/settings-form";

export default async function SettingsPage() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const organization = await getOrganization();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      {organization ? (
        <SettingsForm organization={organization} />
      ) : (
        <p className="text-sm text-muted-foreground">No organization record found.</p>
      )}
    </div>
  );
}
