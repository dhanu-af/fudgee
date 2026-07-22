// Single source of truth for the fixed nutrient list — used by the schema
// (field names), the calculation, the entry forms, and the printed panel.
export const NUTRIENT_FIELDS = [
  { key: "energyKj", label: "Energy", unit: "kJ" },
  { key: "energyKcal", label: "Energy", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "totalFat", label: "Total Fat", unit: "g" },
  { key: "saturatedFat", label: "— Saturated Fat", unit: "g" },
  { key: "transFat", label: "— Trans Fat", unit: "g" },
  { key: "carbohydrates", label: "Carbohydrates", unit: "g" },
  { key: "sugars", label: "— Sugars", unit: "g" },
  { key: "addedSugars", label: "— Added Sugars", unit: "g" },
  { key: "dietaryFibre", label: "Dietary Fibre", unit: "g" },
  { key: "sodium", label: "Sodium", unit: "mg" },
  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
] as const;

export type NutrientKey = (typeof NUTRIENT_FIELDS)[number]["key"];

export type OtherNutrient = { name: string; value: number; unit: string };
