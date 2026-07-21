import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerOptions } from "@/modules/sales-orders/queries";
import { getShipmentOptionsForReturns } from "@/modules/shipping/queries";
import { ReturnForm } from "@/modules/shipping/components/return-form";

export default async function NewReturnPage() {
  await requirePermission(PERMISSIONS.SHIPPING_WRITE);
  const [customers, shipments] = await Promise.all([getCustomerOptions(), getShipmentOptionsForReturns()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New return</h1>
      <ReturnForm
        customers={customers}
        shipments={shipments.map((s) => ({
          id: s.id,
          label: `SHIP-${String(s.seq).padStart(4, "0")} — ${s.salesOrder.customer.name}`,
        }))}
      />
    </div>
  );
}
