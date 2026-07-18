import { z } from "zod";

export const salesOrderLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

export const salesOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  requestedDate: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  linesJson: z.string().min(1, "At least one line item is required"),
});

export type SalesOrderLineInput = z.infer<typeof salesOrderLineSchema>;
export type SalesOrderInput = z.infer<typeof salesOrderSchema>;
