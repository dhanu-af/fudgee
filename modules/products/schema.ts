import { z } from "zod";
import { productMarketingSchema } from "@/modules/storefront/schema";

export const productSchema = z
  .object({
    sku: z.string().min(1, "SKU is required").max(64),
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    type: z.enum(["FINISHED_GOOD", "RAW_MATERIAL", "PACKAGING"]),
    uom: z.string().min(1, "Unit of measure is required").max(20),
    status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]),
    costPrice: z.coerce.number().nonnegative().optional().or(z.nan().transform(() => undefined)),
    sellPrice: z.coerce.number().nonnegative().optional().or(z.nan().transform(() => undefined)),
    reorderPoint: z.coerce.number().nonnegative().optional().or(z.nan().transform(() => undefined)),
  })
  .merge(productMarketingSchema);

export type ProductInput = z.infer<typeof productSchema>;
