import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getRoles } from "@/modules/users/queries";
import { UserCreateForm } from "@/modules/users/components/user-create-form";

export default async function NewUserPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  const roles = await getRoles();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New user</h1>
      <UserCreateForm roles={roles} />
    </div>
  );
}
