import { z } from "zod";

export const qualityCheckSchema = z.object({
  productionBatchId: z.string().min(1, "Batch is required"),
  result: z.enum(["PASS", "FAIL", "PENDING"]),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type QualityCheckInput = z.infer<typeof qualityCheckSchema>;
