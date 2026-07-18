"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { locationSchema } from "@/modules/warehouse/schema";

export type LocationFormState = { error?: string };

export async function createLocation(_prev: LocationFormState, formData: FormData): Promise<LocationFormState> {
  await requirePermission(PERMISSIONS.WAREHOUSE_WRITE);

  const parsed = locationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.location.create({ data: parsed.data });
  } catch {
    return { error: "A location with that code already exists." };
  }

  revalidatePath("/warehouse");
  redirect("/warehouse");
}

export async function updateLocation(
  id: string,
  _prev: LocationFormState,
  formData: FormData
): Promise<LocationFormState> {
  await requirePermission(PERMISSIONS.WAREHOUSE_WRITE);

  const parsed = locationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.location.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A location with that code already exists." };
  }

  revalidatePath("/warehouse");
  redirect("/warehouse");
}

export async function deleteLocation(
  id: string,
  _prev: LocationFormState,
  _formData: FormData
): Promise<LocationFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.location.delete({ where: { id } });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2003") {
      return { error: "Can't delete — this location has inventory transactions recorded against it." };
    }
    return { error: "Failed to delete location." };
  }

  revalidatePath("/warehouse");
  redirect("/warehouse");
}
