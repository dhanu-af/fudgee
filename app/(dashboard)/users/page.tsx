import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { isSuperAdmin } from "@/lib/rbac/can";
import { getUsers } from "@/modules/users/queries";
import { userColumns } from "@/modules/users/components/user-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const users = await getUsers(isSuperAdmin(session));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Management</h1>
        <Button render={<Link href="/users/new" />}>New user</Button>
      </div>
      <DataTable columns={userColumns} data={users} emptyMessage="No users yet." />
    </div>
  );
}
