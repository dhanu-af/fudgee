import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can, isSuperAdmin } from "@/lib/rbac/can";
import { getUserById, getRoles } from "@/modules/users/queries";
import { updateUser, deleteUser } from "@/modules/users/actions";
import { UserEditForm } from "@/modules/users/components/user-edit-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const { id } = await params;
  const viewerIsSuperAdmin = isSuperAdmin(session);
  // getUserById returns null for a Super Admin target when the viewer isn't
  // one, so this 404s exactly like a nonexistent id — the account's
  // existence isn't revealed to anyone but Dhanu.
  const [user, roles] = await Promise.all([
    getUserById(id, viewerIsSuperAdmin),
    getRoles(viewerIsSuperAdmin),
  ]);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit user</h1>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && session.user.id !== id && (
          <DeleteRowButton
            action={deleteUser.bind(null, id)}
            confirmMessage={`Delete user "${user.name}"? This cannot be undone.`}
          />
        )}
      </div>
      <UserEditForm action={updateUser.bind(null, id)} user={user} roles={roles} />
    </div>
  );
}
