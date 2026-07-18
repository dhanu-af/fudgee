import { z } from "zod";

export const productionBatchInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive(),
});

export const productionBatchSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantityPlanned: z.coerce.number().positive("Planned quantity must be greater than zero"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  inputsJson: z.string().min(1, "At least one raw material input is required"),
});

export const completeBatchSchema = z.object({
  quantityActual: z.coerce.number().positive("Actual quantity must be greater than zero"),
  quantityWaste: z.coerce.number().nonnegative().optional().or(z.nan().transform(() => undefined)),
});

export type BatchInputLineInput = z.infer<typeof productionBatchInputSchema>;
export type ProductionBatchFormValues = z.infer<typeof productionBatchSchema>;
