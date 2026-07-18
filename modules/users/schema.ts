import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  roleId: z.string().min(1, "Role is required"),
  temporaryPassword: z.string().min(8, "Temporary password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  roleId: z.string().min(1, "Role is required"),
  isActive: z.coerce.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
