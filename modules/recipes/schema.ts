import { z } from "zod";

export const recipeLineSchema = z.object({
  productId: z.string().min(1),
  percentage: z.coerce.number().positive().max(100),
  uin: z.string().max(100).optional().or(z.literal("")),
  controlStatus: z.enum(["APPROVED", "PENDING"]).default("APPROVED"),
  changeControlRef: z.string().max(200).optional().or(z.literal("")),
  approvedBy: z.string().max(200).optional().or(z.literal("")),
});

export const recipeSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().max(200).optional().or(z.literal("")),
  baseBatchSize: z.coerce.number().positive("Base batch size must be greater than zero"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  linesJson: z.string().min(1, "At least one ingredient is required"),
});

export type RecipeLineInput = z.infer<typeof recipeLineSchema>;
export type RecipeFormValues = z.infer<typeof recipeSchema>;
