import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getUserById, getRoles } from "@/modules/users/queries";
import { updateUser } from "@/modules/users/actions";
import { UserEditForm } from "@/modules/users/components/user-edit-form";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  const { id } = await params;
  const [user, roles] = await Promise.all([getUserById(id), getRoles()]);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit user</h1>
      <UserEditForm action={updateUser.bind(null, id)} user={user} roles={roles} />
    </div>
  );
}
