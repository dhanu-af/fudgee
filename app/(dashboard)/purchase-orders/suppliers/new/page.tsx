import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createSupplier } from "@/modules/suppliers/actions";
import { SupplierForm } from "@/modules/suppliers/components/supplier-form";

export default async function NewSupplierPage() {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New supplier</h1>
      <SupplierForm action={createSupplier} />
    </div>
  );
}
