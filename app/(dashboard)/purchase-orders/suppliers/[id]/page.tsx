import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSupplierById } from "@/modules/suppliers/queries";
import { updateSupplier } from "@/modules/suppliers/actions";
import { SupplierForm } from "@/modules/suppliers/components/supplier-form";

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.PURCHASE_ORDERS_WRITE);
  const { id } = await params;
  const supplier = await getSupplierById(id);
  if (!supplier) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit supplier</h1>
      <SupplierForm action={updateSupplier.bind(null, id)} supplier={supplier} />
    </div>
  );
}
