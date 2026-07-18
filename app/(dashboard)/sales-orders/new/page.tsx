import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerOptions, getProductOptions } from "@/modules/sales-orders/queries";
import { SalesOrderForm } from "@/modules/sales-orders/components/sales-order-form";

export default async function NewSalesOrderPage() {
  await requirePermission(PERMISSIONS.SALES_ORDERS_WRITE);
  const [customers, products] = await Promise.all([getCustomerOptions(), getProductOptions()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New sales order</h1>
      {customers.length === 0 || products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You need at least one active customer and one active product before creating a sales order.
        </p>
      ) : (
        <SalesOrderForm
          customers={customers.map((c) => ({ id: c.id, label: c.name }))}
          products={products.map((p) => ({
            id: p.id,
            label: `${p.name} (${p.sku})`,
            sellPrice: p.sellPrice ? Number(p.sellPrice) : null,
          }))}
        />
      )}
    </div>
  );
}
