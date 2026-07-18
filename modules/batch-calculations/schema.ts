import { z } from "zod";

export const batchCalculationSchema = z.object({
  recipeId: z.string().min(1),
  batchNumber: z.string().max(100).optional().or(z.literal("")),
  requiredBatchSize: z.coerce.number().positive("Required batch size must be greater than zero"),
  tolerancePercent: z.coerce.number().nonnegative().max(100).optional().or(z.nan().transform(() => 2)),
  enteredBy: z.string().max(200).optional().or(z.literal("")),
  checkedBy: z.string().max(200).optional().or(z.literal("")),
  calculationDate: z.string().optional().or(z.literal("")),
});

export type BatchCalculationInput = z.infer<typeof batchCalculationSchema>;
