import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getProductOptions, getActiveLocationOptions } from "@/modules/inventory/queries";
import { AdjustmentForm } from "@/modules/inventory/components/adjustment-form";

export default async function AdjustInventoryPage() {
  await requirePermission(PERMISSIONS.INVENTORY_WRITE);
  const [products, locations] = await Promise.all([getProductOptions(), getActiveLocationOptions()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Record stock adjustment</h1>
      <AdjustmentForm
        products={products.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))}
        locations={locations.map((l) => ({ id: l.id, label: l.name }))}
      />
    </div>
  );
}
