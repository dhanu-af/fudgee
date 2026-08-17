import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getDeliveryFreeRules, getDeliveryZones, getStorefrontSettings } from "@/modules/storefront/queries";
import { deliveryZoneColumns } from "@/modules/storefront/components/delivery-zone-columns";
import { deliveryFreeRuleColumns } from "@/modules/storefront/components/delivery-free-rule-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontDeliveryPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const [settings, freeRules, zones] = await Promise.all([
    getStorefrontSettings(),
    getDeliveryFreeRules(),
    getDeliveryZones(),
  ]);

  const originConfigured = settings?.originLat != null && settings?.originLng != null;

  return (
    <div className="flex flex-col gap-6">
      <TabNav active="/storefront/delivery" tabs={STOREFRONT_TABS} />

      <div
        className={`rounded-lg border p-4 text-sm ${
          originConfigured ? "border-border bg-muted/30" : "border-destructive/40 bg-destructive/10"
        }`}
      >
        {originConfigured ? (
          <>
            Delivery distance is measured from <strong>{settings?.originAddress}</strong>. To change it, go to{" "}
            <Link href="/storefront/settings" className="underline">
              Settings
            </Link>
            .
          </>
        ) : (
          <>
            No delivery origin address is set yet, so delivery fees can&apos;t be calculated — every checkout will
            show &quot;fee to be confirmed&quot; until this is fixed. Set it on the{" "}
            <Link href="/storefront/settings" className="underline">
              Settings
            </Link>{" "}
            page (Shipping &amp; delivery section).
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Free delivery rules</h1>
            <p className="text-sm text-muted-foreground">
              Checked first, in priority order. The first matching rule gives free delivery outright.
            </p>
          </div>
          <Button render={<Link href="/storefront/delivery/rules/new" />}>New rule</Button>
        </div>
        <DataTable columns={deliveryFreeRuleColumns} data={freeRules} emptyMessage="No free-delivery rules yet." />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Delivery zones</h1>
            <p className="text-sm text-muted-foreground">
              Distance-based fees, checked when no free-delivery rule matches. An address beyond every zone&apos;s
              upper limit is automatically treated as outside your delivery area.
            </p>
          </div>
          <Button render={<Link href="/storefront/delivery/zones/new" />}>New zone</Button>
        </div>
        <DataTable columns={deliveryZoneColumns} data={zones} emptyMessage="No delivery zones yet." />
      </div>
    </div>
  );
}
