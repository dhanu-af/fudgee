import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createCustomer } from "@/modules/customers/actions";
import { CustomerForm } from "@/modules/customers/components/customer-form";

export default async function NewCustomerPage() {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New customer</h1>
      <CustomerForm action={createCustomer} />
    </div>
  );
}
