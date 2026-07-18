"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { qualityCheckSchema } from "@/modules/quality/schema";

export type QualityCheckFormState = { error?: string };

export async function createQualityCheck(
  _prev: QualityCheckFormState,
  formData: FormData
): Promise<QualityCheckFormState> {
  const session = await requirePermission(PERMISSIONS.QUALITY_WRITE);

  const parsed = qualityCheckSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.qualityCheck.create({
    data: {
      productionBatchId: parsed.data.productionBatchId,
      result: parsed.data.result,
      notes: parsed.data.notes || undefined,
      checkedAt: new Date(),
      checkedByUserId: session.user.id,
    },
  });

  revalidatePath("/quality");
  revalidatePath(`/production/${parsed.data.productionBatchId}`);
  redirect("/quality");
}

export async function deleteQualityCheck(
  id: string,
  _prev: QualityCheckFormState,
  _formData: FormData
): Promise<QualityCheckFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const check = await db.qualityCheck.findUnique({ where: { id }, select: { productionBatchId: true } });

  try {
    await db.qualityCheck.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete quality check." };
  }

  revalidatePath("/quality");
  if (check) revalidatePath(`/production/${check.productionBatchId}`);
  return {};
}
