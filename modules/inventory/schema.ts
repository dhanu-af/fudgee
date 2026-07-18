import { z } from "zod";

export const adjustmentSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  locationId: z.string().min(1, "Location is required"),
  direction: z.enum(["INCREASE", "DECREASE"]),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type AdjustmentInput = z.infer<typeof adjustmentSchema>;
