import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerOptions } from "@/modules/sales-orders/queries";
import { getUninvoicedSalesOrders } from "@/modules/finance/queries";
import { InvoiceForm } from "@/modules/finance/components/invoice-form";
import { CustomerPickerForm } from "@/modules/finance/components/customer-picker-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);
  const { customerId } = await searchParams;
  const customers = await getCustomerOptions();

  if (!customerId) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">New invoice</h1>
        <CustomerPickerForm customers={customers} />
      </div>
    );
  }

  const orders = await getUninvoicedSalesOrders(customerId);
  const customer = customers.find((c) => c.id === customerId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{`New invoice — ${customer?.name ?? "Customer"}`}</h1>
      <InvoiceForm customerId={customerId} orders={orders} />
    </div>
  );
}
