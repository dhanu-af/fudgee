import { db } from "@/lib/db";
import { computeNutritionFromRecipe } from "@/modules/nutrition/lib/nutrition-calc";

export function getNutritionProfileByProductId(productId: string) {
  return db.nutritionProfile.findUnique({ where: { productId } });
}

// The Recipe + ingredient NutritionProfiles needed to drive the calculation
// for a finished good's batches.
export function getRecipeWithNutritionByProductId(productId: string) {
  return db.recipe.findUnique({
    where: { productId },
    include: { lines: { include: { product: { include: { nutritionProfile: true } } } } },
  });
}

export function getBatchNutritionAuditLog(batchNutritionId: string) {
  return db.nutritionAuditLog.findMany({
    where: { batchNutritionId },
    orderBy: { changedAt: "desc" },
    include: { changedByUser: { select: { name: true } } },
  });
}

// Returns the batch's BatchNutrition row, creating and computing it from the
// recipe on first access. Returns null if the batch's product has no Recipe
// yet (nothing to calculate from).
export async function getOrInitBatchNutrition(productionBatchId: string) {
  const existing = await db.batchNutrition.findUnique({
    where: { productionBatchId },
    include: {
      auditLogs: { orderBy: { changedAt: "desc" }, include: { changedByUser: { select: { name: true } } } },
      lockedByUser: { select: { name: true } },
    },
  });
  if (existing) return existing;

  const batch = await db.productionBatch.findUnique({
    where: { id: productionBatchId },
    select: { productId: true, product: { select: { servingSizeGrams: true } } },
  });
  if (!batch) return null;

  const recipe = await getRecipeWithNutritionByProductId(batch.productId);
  if (!recipe) return null;

  const servingSizeGrams = batch.product.servingSizeGrams != null ? Number(batch.product.servingSizeGrams) : null;
  const { per100g, otherNutrientsPer100g } = computeNutritionFromRecipe(
    recipe.lines.map((l) => ({ percentage: l.percentage, product: l.product })),
    servingSizeGrams
  );

  const created = await db.batchNutrition.create({
    data: {
      productionBatchId,
      servingSizeGrams,
      ...per100g,
      otherNutrients: otherNutrientsPer100g.length > 0 ? otherNutrientsPer100g : undefined,
    },
    include: {
      auditLogs: { orderBy: { changedAt: "desc" }, include: { changedByUser: { select: { name: true } } } },
      lockedByUser: { select: { name: true } },
    },
  });
  return created;
}
