"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS, SUPER_ADMIN_ROLE_KEY } from "@/lib/rbac/permissions";
import { isSuperAdmin } from "@/lib/rbac/can";
import { createUserSchema, updateUserSchema } from "@/modules/users/schema";

export type UserFormState = { error?: string };

const ROLE_DENIED_ERROR = "Invalid role selected.";
const USER_NOT_FOUND_ERROR = "User not found.";

// A non-Super-Admin submitting a roleId is only ever allowed to pick a role
// that isn't Super Admin — checked against the DB, not the dropdown they saw,
// since a form can be forged with a Super Admin roleId that was never
// actually rendered to them.
async function assertAssignableRole(roleId: string, viewerIsSuperAdmin: boolean) {
  if (viewerIsSuperAdmin) return true;
  const role = await db.role.findUnique({ where: { id: roleId } });
  return role !== null && role.key !== SUPER_ADMIN_ROLE_KEY;
}

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (!(await assertAssignableRole(parsed.data.roleId, isSuperAdmin(session)))) {
    return { error: ROLE_DENIED_ERROR };
  }

  const passwordHash = await bcrypt.hash(parsed.data.temporaryPassword, 10);

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        email: parsed.data.email,
        roleId: parsed.data.roleId,
        passwordHash,
        mustChangePassword: true,
      },
    });
  } catch {
    return { error: "A user with that User ID or email already exists." };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(
  id: string,
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const viewerIsSuperAdmin = isSuperAdmin(session);

  // The target being Super Admin is checked independently of whatever the
  // (possibly forged) form data claims, so a non-Super-Admin can't view,
  // edit, promote, or demote that account under any circumstances.
  const target = await db.user.findUnique({ where: { id }, include: { role: true } });
  if (!target || (target.role.key === SUPER_ADMIN_ROLE_KEY && !viewerIsSuperAdmin)) {
    return { error: USER_NOT_FOUND_ERROR };
  }

  const parsed = updateUserSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    roleId: formData.get("roleId"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (!(await assertAssignableRole(parsed.data.roleId, viewerIsSuperAdmin))) {
    return { error: ROLE_DENIED_ERROR };
  }

  try {
    await db.user.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A user with that User ID already exists." };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(id: string, _prev: UserFormState, _formData: FormData): Promise<UserFormState> {
  const session = await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  if (session.user.id === id) {
    return { error: "You can't delete your own account." };
  }

  const target = await db.user.findUnique({ where: { id }, include: { role: true } });
  if (!target || (target.role.key === SUPER_ADMIN_ROLE_KEY && !isSuperAdmin(session))) {
    return { error: USER_NOT_FOUND_ERROR };
  }

  try {
    await db.user.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete user." };
  }

  revalidatePath("/users");
  redirect("/users");
}
