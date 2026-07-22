import { NUTRIENT_FIELDS, type NutrientKey, type OtherNutrient } from "@/modules/nutrition/lib/nutrients";

type NutritionProfileLike = Partial<Record<NutrientKey, unknown>> & { otherNutrients: unknown } | null;

type RecipeLineLike = {
  percentage: unknown;
  product: { nutritionProfile: NutritionProfileLike };
};

export type NutrientValues = Partial<Record<NutrientKey, number>>;

function parseOtherNutrients(raw: unknown): OtherNutrient[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (n): n is OtherNutrient =>
      n && typeof n === "object" && typeof n.name === "string" && typeof n.value === "number"
  );
}

// Weighted average across Recipe lines: percentage/100 × ingredient's
// per-100g value. Valid because Recipe percentages are validated to sum to
// ~100% w/w when the recipe is saved (modules/recipes/actions.ts). A nutrient
// only appears in the result if at least one ingredient has a value for it —
// ingredients missing that nutrient are treated as contributing 0, a known
// simplification rather than "this nutrient is entirely unknown."
export function computeNutritionFromRecipe(lines: RecipeLineLike[], servingSizeGrams: number | null) {
  const per100g: NutrientValues = {};

  for (const field of NUTRIENT_FIELDS) {
    let sum = 0;
    let hasAny = false;
    for (const line of lines) {
      const profile = line.product.nutritionProfile;
      const raw = profile?.[field.key];
      if (raw !== null && raw !== undefined) {
        const pct = Number(line.percentage ?? 0);
        sum += (pct / 100) * Number(raw);
        hasAny = true;
      }
    }
    if (hasAny) per100g[field.key] = Math.round(sum * 1000) / 1000;
  }

  const otherTotals = new Map<string, { value: number; unit: string }>();
  for (const line of lines) {
    const pct = Number(line.percentage ?? 0);
    const others = parseOtherNutrients(line.product.nutritionProfile?.otherNutrients);
    for (const n of others) {
      const existing = otherTotals.get(n.name);
      const contribution = (pct / 100) * n.value;
      if (existing) {
        existing.value += contribution;
      } else {
        otherTotals.set(n.name, { value: contribution, unit: n.unit });
      }
    }
  }
  const otherNutrientsPer100g: OtherNutrient[] = [...otherTotals.entries()].map(([name, { value, unit }]) => ({
    name,
    value: Math.round(value * 1000) / 1000,
    unit,
  }));

  const scale = servingSizeGrams != null ? servingSizeGrams / 100 : null;
  let perServing: NutrientValues | null = null;
  let otherNutrientsPerServing: OtherNutrient[] | null = null;
  if (scale !== null) {
    perServing = {};
    for (const field of NUTRIENT_FIELDS) {
      const v = per100g[field.key];
      if (v !== undefined) perServing[field.key] = Math.round(v * scale * 1000) / 1000;
    }
    otherNutrientsPerServing = otherNutrientsPer100g.map((n) => ({
      ...n,
      value: Math.round(n.value * scale * 1000) / 1000,
    }));
  }

  return { per100g, otherNutrientsPer100g, perServing, otherNutrientsPerServing };
}
