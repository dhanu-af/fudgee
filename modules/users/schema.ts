import { z } from "zod";

const usernamePattern = /^[a-zA-Z0-9_.-]+$/;

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  username: z.string().min(2, "User ID must be at least 2 characters").max(50).regex(usernamePattern, "User ID can only contain letters, numbers, and . _ -"),
  email: z.string().email("Valid email is required"),
  roleId: z.string().min(1, "Role is required"),
  temporaryPassword: z.string().min(8, "Temporary password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  username: z.string().min(2, "User ID must be at least 2 characters").max(50).regex(usernamePattern, "User ID can only contain letters, numbers, and . _ -"),
  roleId: z.string().min(1, "Role is required"),
  isActive: z.coerce.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
