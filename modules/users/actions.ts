"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/modules/users/schema";

export type UserFormState = { error?: string };

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
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
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const parsed = updateUserSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    roleId: formData.get("roleId"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
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
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const session = await auth();
  if (session?.user.id === id) {
    return { error: "You can't delete your own account." };
  }

  try {
    await db.user.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete user." };
  }

  revalidatePath("/users");
  redirect("/users");
}
