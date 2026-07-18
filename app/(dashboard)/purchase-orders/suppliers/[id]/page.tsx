import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getSupplierById } from "@/modules/suppliers/queries";
import { updateSupplier, deleteSupplier } from "@/modules/suppliers/actions";
import { SupplierForm } from "@/modules/suppliers/components/supplier-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);
  const { id } = await params;
  const supplier = await getSupplierById(id);
  if (!supplier) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit supplier</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteSupplier.bind(null, id)}
            confirmMessage={`Delete "${supplier.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <SupplierForm action={updateSupplier.bind(null, id)} supplier={supplier} />
    </div>
  );
}
