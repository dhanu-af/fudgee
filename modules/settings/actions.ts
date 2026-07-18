"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { organizationSchema } from "@/modules/settings/schema";

export type SettingsFormState = { error?: string; success?: boolean };

export async function updateOrganization(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const parsed = organizationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const org = await db.organization.findFirst();
  if (!org) return { error: "Organization record not found." };

  await db.organization.update({
    where: { id: org.id },
    data: {
      name: parsed.data.name,
      timezone: parsed.data.timezone,
      currency: parsed.data.currency,
      address: parsed.data.address || undefined,
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
