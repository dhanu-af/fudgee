"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { NUTRIENT_FIELDS } from "@/modules/nutrition/lib/nutrients";
import { computeNutritionFromRecipe } from "@/modules/nutrition/lib/nutrition-calc";
import { getRecipeWithNutritionByProductId } from "@/modules/nutrition/queries";
import {
  nutritionProfileSchema,
  otherNutrientEntrySchema,
  batchNutritionFieldEditSchema,
} from "@/modules/nutrition/schema";

export type NutritionFormState = { error?: string };

// --- Ingredient nutrition database (per Product) ---

export async function upsertNutritionProfile(
  productId: string,
  _prev: NutritionFormState,
  formData: FormData
): Promise<NutritionFormState> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = nutritionProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let otherNutrients: { name: string; value: number; unit: string }[] | undefined;
  if (parsed.data.otherNutrientsJson) {
    try {
      const raw = JSON.parse(parsed.data.otherNutrientsJson);
      const arrParsed = z.array(otherNutrientEntrySchema).safeParse(raw);
      if (!arrParsed.success) return { error: "Invalid extra nutrient entries." };
      otherNutrients = arrParsed.data.length > 0 ? arrParsed.data : undefined;
    } catch {
      return { error: "Invalid extra nutrient entries." };
    }
  }

  const { servingSizeGrams, otherNutrientsJson: _omit, ...nutrientValues } = parsed.data;

  await db.$transaction([
    db.product.update({ where: { id: productId }, data: { servingSizeGrams } }),
    db.nutritionProfile.upsert({
      where: { productId },
      create: { productId, ...nutrientValues, otherNutrients },
      update: { ...nutrientValues, otherNutrients },
    }),
  ]);

  revalidatePath(`/products/${productId}`);
  return {};
}

// --- Batch nutrition (working record + locked snapshot) ---

export async function recalculateBatchNutrition(
  id: string,
  _prev: NutritionFormState,
  _formData: FormData
): Promise<NutritionFormState> {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const existing = await db.batchNutrition.findUnique({
    where: { id },
    include: { productionBatch: { select: { productId: true } } },
  });
  if (!existing) return { error: "Not found." };
  if (existing.isLocked) return { error: "This nutrition panel is locked and can no longer be changed." };

  const recipe = await getRecipeWithNutritionByProductId(existing.productionBatch.productId);
  if (!recipe) return { error: "This product has no recipe to calculate nutrition from." };

  const servingSizeGrams = existing.servingSizeGrams != null ? Number(existing.servingSizeGrams) : null;
  const { per100g } = computeNutritionFromRecipe(
    recipe.lines.map((l) => ({ percentage: l.percentage, product: l.product })),
    servingSizeGrams
  );

  const auditEntries: { field: string; oldValue: string | null; newValue: string | null }[] = [];
  for (const f of NUTRIENT_FIELDS) {
    const oldVal = existing[f.key] != null ? String(existing[f.key]) : null;
    const newVal = per100g[f.key] != null ? String(per100g[f.key]) : null;
    if (oldVal !== newVal) auditEntries.push({ field: f.key, oldValue: oldVal, newValue: newVal });
  }

  await db.$transaction([
    db.batchNutrition.update({ where: { id }, data: per100g }),
    ...auditEntries.map((entry) =>
      db.nutritionAuditLog.create({
        data: { batchNutritionId: id, ...entry, changedByUserId: session.user.id },
      })
    ),
  ]);

  revalidatePath(`/production/${existing.productionBatchId}/nutrition`);
  return {};
}

export async function updateBatchNutritionField(
  id: string,
  _prev: NutritionFormState,
  formData: FormData
): Promise<NutritionFormState> {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = batchNutritionFieldEditSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.batchNutrition.findUnique({ where: { id } });
  if (!existing) return { error: "Not found." };
  if (existing.isLocked) return { error: "This nutrition panel is locked and can no longer be changed." };

  const { field, value, reason } = parsed.data;
  const newValue = value.trim() === "" ? null : Number(value);
  if (newValue !== null && Number.isNaN(newValue)) return { error: "Enter a valid number." };

  const oldRaw = existing[field as keyof typeof existing];
  const oldValue = oldRaw != null ? String(oldRaw) : null;
  const newValueStr = newValue !== null ? String(newValue) : null;

  if (oldValue !== newValueStr) {
    await db.$transaction([
      db.batchNutrition.update({ where: { id }, data: { [field]: newValue } }),
      db.nutritionAuditLog.create({
        data: {
          batchNutritionId: id,
          field,
          oldValue,
          newValue: newValueStr,
          reason: reason || undefined,
          changedByUserId: session.user.id,
        },
      }),
    ]);
  }

  revalidatePath(`/production/${existing.productionBatchId}/nutrition`);
  return {};
}

// Called from modules/quality/actions.ts's createQualityCheck when a PASS
// result is recorded — not a form action, no permission check of its own
// (the caller has already authorized the quality-check write). Idempotent:
// a batch with multiple QC records only locks on the first PASS.
export async function lockBatchNutritionOnPass(productionBatchId: string, userId: string): Promise<void> {
  const existing = await db.batchNutrition.findUnique({ where: { productionBatchId } });
  if (!existing || existing.isLocked) return;

  await db.batchNutrition.update({
    where: { productionBatchId },
    data: { isLocked: true, lockedAt: new Date(), lockedByUserId: userId },
  });
}
