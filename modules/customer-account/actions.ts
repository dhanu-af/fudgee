"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createCustomerSession, destroyCustomerSession } from "@/lib/customer-auth";
import { customerSignUpSchema, customerSignInSchema } from "@/modules/customer-account/schema";

export type CustomerAuthFormState = { error?: string };

// Same hashing approach as staff accounts (modules/users/actions.ts) — cost
// factor 10, bcryptjs — kept identical rather than introducing a second
// hashing library for a second kind of account.
const BCRYPT_COST = 10;

export async function signUpCustomer(
  _prev: CustomerAuthFormState,
  formData: FormData
): Promise<CustomerAuthFormState> {
  const parsed = customerSignUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { name, email, phone, password } = parsed.data;

  const existing = await db.customer.findFirst({ where: { email } });
  if (existing?.passwordHash) {
    return { error: "An account with this email already exists — try signing in instead." };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  // If a guest checkout already created a Customer row for this email,
  // claim it (and its order history) instead of creating a duplicate.
  const customer = existing
    ? await db.customer.update({
        where: { id: existing.id },
        data: { passwordHash, name, phone: existing.phone ?? phone },
      })
    : await db.customer.create({ data: { name, email, phone, passwordHash } });

  await createCustomerSession(customer.id);
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signInCustomer(
  _prev: CustomerAuthFormState,
  formData: FormData
): Promise<CustomerAuthFormState> {
  const parsed = customerSignInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const customer = await db.customer.findFirst({ where: { email: parsed.data.email } });
  // Same generic message whether the email doesn't exist, has no password
  // yet (guest-only record), or the password is wrong — never reveal which.
  if (!customer || !customer.passwordHash || !customer.isActive) {
    return { error: "Incorrect email or password." };
  }

  const valid = await bcrypt.compare(parsed.data.password, customer.passwordHash);
  if (!valid) return { error: "Incorrect email or password." };

  await createCustomerSession(customer.id);
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOutCustomer() {
  await destroyCustomerSession();
  revalidatePath("/", "layout");
  redirect("/");
}
