import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  timezone: z.string().min(1, "Timezone is required").max(100),
  currency: z.string().min(1, "Currency is required").max(10),
  address: z.string().max(500).optional().or(z.literal("")),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
