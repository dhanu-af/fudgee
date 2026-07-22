import { z } from "zod";
import { productMarketingSchema } from "@/modules/storefront/schema";

// z.coerce.number() turns "" into 0 (Number("") === 0), not NaN, so a plain
// .optional().or(z.nan()...) fallback never fires for a blank input — same
// gotcha already hit and fixed for tolerancePercent (modules/batch-calculations/schema.ts)
// and nutrition (modules/nutrition/schema.ts). Preprocessing blank/missing to
// undefined first is the fix.
const optionalNumber = () =>
  z.preprocess((val) => (val === "" || val == null ? undefined : val), z.coerce.number().nonnegative().optional());

export const productSchema = z
  .object({
    sku: z.string().min(1, "SKU is required").max(64),
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    type: z.enum(["FINISHED_GOOD", "RAW_MATERIAL", "PACKAGING"]),
    uom: z.string().min(1, "Unit of measure is required").max(20),
    status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]),
    costPrice: optionalNumber(),
    sellPrice: optionalNumber(),
    reorderPoint: optionalNumber(),
  })
  .merge(productMarketingSchema);

export type ProductInput = z.infer<typeof productSchema>;
