import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getCustomerById, getPromoCodesByCustomerId } from "@/modules/customers/queries";
import { updateCustomer, deleteCustomer } from "@/modules/customers/actions";
import { CustomerForm } from "@/modules/customers/components/customer-form";
import { PromoCodeManager } from "@/modules/customers/components/promo-code-manager";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);
  const { id } = await params;
  const [customer, promoCodes] = await Promise.all([getCustomerById(id), getPromoCodesByCustomerId(id)]);
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

      <div className="flex max-w-2xl flex-col gap-2 rounded-lg border border-border/60 p-4">
        <h2 className="text-sm font-semibold tracking-tight">Promo codes</h2>
        <p className="text-xs text-muted-foreground">
          Special discount codes for this customer only — shown on their account page and redeemed at checkout.
          Unrelated to the sitewide/spend-tier discounts under Storefront &gt; Promotions.
        </p>
        <PromoCodeManager customerId={id} promoCodes={promoCodes} />
      </div>
    </div>
  );
}
