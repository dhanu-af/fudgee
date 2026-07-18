import { z } from "zod";

export const recipeLineSchema = z.object({
  productId: z.string().min(1),
  quantityPerUnit: z.coerce.number().positive(),
});

export const recipeSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  linesJson: z.string().min(1, "At least one ingredient is required"),
});

export type RecipeLineInput = z.infer<typeof recipeLineSchema>;
export type RecipeFormValues = z.infer<typeof recipeSchema>;
