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
  // Optional manual override for the SO-#### number — left blank, the usual
  // auto-incrementing number is used. z.coerce.number() turns "" into 0, not
  // NaN, so blank/missing must be preprocessed to undefined first (same
  // gotcha fixed elsewhere in this codebase).
  orderNumber: z.preprocess(
    (val) => (val === "" || val == null ? undefined : val),
    z.coerce.number().int().positive().optional()
  ),
});

export type SalesOrderLineInput = z.infer<typeof salesOrderLineSchema>;
export type SalesOrderInput = z.infer<typeof salesOrderSchema>;
