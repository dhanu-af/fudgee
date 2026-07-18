"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { batchCalculationSchema } from "@/modules/batch-calculations/schema";

export type BatchCalculationFormState = { error?: string };

export async function createBatchCalculation(
  _prev: BatchCalculationFormState,
  formData: FormData
): Promise<BatchCalculationFormState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = batchCalculationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const recipe = await db.recipe.findUnique({ where: { id: parsed.data.recipeId }, include: { lines: true } });
  if (!recipe) return { error: "Recipe not found." };

  const tolerance = parsed.data.tolerancePercent;
  const requiredBatchSize = parsed.data.requiredBatchSize;

  const lines = recipe.lines.map((line) => {
    const percentage = Number(line.percentage ?? 0);
    const calculatedQty = (percentage / 100) * requiredBatchSize;
    const roundedQty = Math.round(calculatedQty * 100) / 100;
    const minQty = roundedQty * (1 - tolerance / 100);
    const maxQty = roundedQty * (1 + tolerance / 100);
    return {
      productId: line.productId,
      percentage,
      calculatedQty,
      roundedQty,
      minQty,
      maxQty,
    };
  });

  const calculation = await db.batchCalculation.create({
    data: {
      recipeId: parsed.data.recipeId,
      batchNumber: parsed.data.batchNumber || undefined,
      requiredBatchSize,
      tolerancePercent: tolerance,
      enteredBy: parsed.data.enteredBy || undefined,
      checkedBy: parsed.data.checkedBy || undefined,
      calculationDate: parsed.data.calculationDate ? new Date(parsed.data.calculationDate) : undefined,
      lines: { create: lines },
    },
  });

  revalidatePath(`/production/recipes/${parsed.data.recipeId}`);
  redirect(`/production/recipes/${parsed.data.recipeId}/calculations/${calculation.id}`);
}

export type ActualDispensedState = { error?: string };

export async function updateActualDispensed(
  lineId: string,
  recipeId: string,
  _prev: ActualDispensedState,
  formData: FormData
): Promise<ActualDispensedState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const raw = formData.get("actualDispensed");
  const value = raw !== null && raw !== "" ? Number(raw) : null;
  if (value !== null && (Number.isNaN(value) || value < 0)) {
    return { error: "Enter a valid, non-negative quantity." };
  }

  await db.batchCalculationLine.update({
    where: { id: lineId },
    data: { actualDispensed: value },
  });

  revalidatePath(`/production/recipes/${recipeId}`);
  return {};
}

export type BatchCalculationActionState = { error?: string };

export async function deleteBatchCalculation(
  id: string,
  recipeId: string,
  _prev: BatchCalculationActionState,
  _formData: FormData
): Promise<BatchCalculationActionState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.batchCalculation.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete batch calculation." };
  }

  revalidatePath(`/production/recipes/${recipeId}`);
  redirect(`/production/recipes/${recipeId}`);
}
