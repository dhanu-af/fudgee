import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? undefined : v));

export const customerSignUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Must be a valid email").max(200),
    phone: optionalText(50),
    password: z.string().min(8, "Password must be at least 8 characters").max(200),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>;

export const customerSignInSchema = z.object({
  email: z.string().email("Must be a valid email").max(200),
  password: z.string().min(1, "Password is required"),
});
export type CustomerSignInInput = z.infer<typeof customerSignInSchema>;
