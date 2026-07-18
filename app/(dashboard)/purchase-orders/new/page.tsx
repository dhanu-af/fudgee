import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSupplierOptions, getProductOptions } from "@/modules/purchase-orders/queries";
import { PurchaseOrderForm } from "@/modules/purchase-orders/components/purchase-order-form";

export default async function NewPurchaseOrderPage() {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);
  const [suppliers, products] = await Promise.all([getSupplierOptions(), getProductOptions()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New purchase order</h1>
      {suppliers.length === 0 || products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You need at least one active supplier and one active product before creating a purchase order.
        </p>
      ) : (
        <PurchaseOrderForm
          suppliers={suppliers.map((s) => ({ id: s.id, label: s.name }))}
          products={products.map((p) => ({
            id: p.id,
            label: `${p.name} (${p.sku})`,
            costPrice: p.costPrice ? Number(p.costPrice) : null,
          }))}
        />
      )}
    </div>
  );
}
