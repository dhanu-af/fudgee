import { z } from "zod";

// Normalized to uppercase on save so redemption at checkout isn't
// case-sensitive — a customer typing "dhanu20" still matches "DHANU20".
export const promoCodeSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(30)
    .regex(/^[A-Za-z0-9-]+$/, "Code can only contain letters, numbers, and hyphens")
    .transform((v) => v.toUpperCase()),
  discountPercent: z.coerce
    .number()
    .int()
    .min(1, "Discount % must be between 1 and 100")
    .max(100, "Discount % must be between 1 and 100"),
  // Blank clears an existing expiry — must resolve to explicit null, not
  // undefined, since Prisma's update() treats undefined as "leave alone"
  // and would silently fail to remove a previously-set date.
  expiresAt: z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : val),
      z.coerce.date().optional()
    )
    .transform((v) => v ?? null),
  isActive: z.coerce.boolean(),
});
export type PromoCodeInput = z.infer<typeof promoCodeSchema>;

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z
    .string()
    .max(64)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  billingAddress: z.string().max(500).optional().or(z.literal("")),
  shippingAddress: z.string().max(500).optional().or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;
