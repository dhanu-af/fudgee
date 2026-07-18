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
