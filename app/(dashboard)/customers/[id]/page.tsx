import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCustomerById } from "@/modules/customers/queries";
import { updateCustomer, deleteCustomer } from "@/modules/customers/actions";
import { CustomerForm } from "@/modules/customers/components/customer-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit customer</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteCustomer.bind(null, id)}
            confirmMessage={`Delete "${customer.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <CustomerForm action={updateCustomer.bind(null, id)} customer={customer} />
    </div>
  );
}
