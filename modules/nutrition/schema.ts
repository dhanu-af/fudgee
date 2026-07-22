import { z } from "zod";
import { NUTRIENT_FIELDS } from "@/modules/nutrition/lib/nutrients";

// z.coerce.number() turns "" into 0 (Number("") === 0), not NaN, so a plain
// .optional().or(z.nan()...) fallback never fires for a blank input — same
// gotcha already hit and fixed for tolerancePercent in
// modules/batch-calculations/schema.ts. Preprocessing blank/missing to
// undefined first is the fix.
const optionalNumber = () =>
  z.preprocess((val) => (val === "" || val == null ? undefined : val), z.coerce.number().nonnegative().optional());

const nutrientNumberFields = Object.fromEntries(NUTRIENT_FIELDS.map((f) => [f.key, optionalNumber()])) as Record<
  (typeof NUTRIENT_FIELDS)[number]["key"],
  ReturnType<typeof optionalNumber>
>;

export const otherNutrientEntrySchema = z.object({
  name: z.string().min(1).max(100),
  value: z.coerce.number(),
  unit: z.string().min(1).max(20),
});

export const nutritionProfileSchema = z.object({
  servingSizeGrams: optionalNumber(),
  ...nutrientNumberFields,
  otherNutrientsJson: z.string().optional().or(z.literal("")),
});
export type NutritionProfileInput = z.infer<typeof nutritionProfileSchema>;

const EDITABLE_BATCH_FIELDS = [...NUTRIENT_FIELDS.map((f) => f.key), "servingSizeGrams"] as const;

export const batchNutritionFieldEditSchema = z.object({
  field: z.enum(EDITABLE_BATCH_FIELDS),
  value: z.string().max(50), // empty string = clear the field
  reason: z.string().max(500).optional().or(z.literal("")),
});
export type BatchNutritionFieldEditInput = z.infer<typeof batchNutritionFieldEditSchema>;
