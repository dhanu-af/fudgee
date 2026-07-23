import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { StorefrontSettingsForm } from "@/modules/storefront/components/storefront-settings-form";
import { WhatsAppTestButton } from "@/modules/storefront/components/whatsapp-test-button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontSettingsPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const settings = await getStorefrontSettings();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/settings" tabs={STOREFRONT_TABS} />
      <h1 className="text-xl font-semibold">Storefront settings</h1>
      <StorefrontSettingsForm settings={settings} />
      <WhatsAppTestButton />
    </div>
  );
}
