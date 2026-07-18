import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z
    .string()
    .max(64)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
});

export type SupplierInput = z.infer<typeof supplierSchema>;
