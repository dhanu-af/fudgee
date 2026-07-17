import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerById } from "@/modules/customers/queries";
import { updateCustomer } from "@/modules/customers/actions";
import { CustomerForm } from "@/modules/customers/components/customer-form";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit customer</h1>
      <CustomerForm action={updateCustomer.bind(null, id)} customer={customer} />
    </div>
  );
}
