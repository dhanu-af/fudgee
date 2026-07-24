"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCustomerSession } from "@/lib/customer-auth";
import { customerSchema, promoCodeSchema } from "@/modules/customers/schema";
import { getValidPromoCode } from "@/modules/customers/queries";

export type CustomerFormState = { error?: string };

export async function createCustomer(_prev: CustomerFormState, formData: FormData): Promise<CustomerFormState> {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.customer.create({ data: parsed.data });
  } catch {
    return { error: "A customer with that code already exists." };
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(
  id: string,
  _prev: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.customer.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A customer with that code already exists." };
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export type PromoCodeFormState = { error?: string };

export async function createPromoCode(
  customerId: string,
  _prev: PromoCodeFormState,
  formData: FormData
): Promise<PromoCodeFormState> {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  const parsed = promoCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await db.promoCode.create({ data: { ...parsed.data, customerId } });
  } catch {
    return { error: "That code is already in use — try a different one." };
  }

  revalidatePath(`/customers/${customerId}`);
  return {};
}

export async function updatePromoCode(
  id: string,
  customerId: string,
  _prev: PromoCodeFormState,
  formData: FormData
): Promise<PromoCodeFormState> {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  const parsed = promoCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await db.promoCode.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "That code is already in use — try a different one." };
  }

  revalidatePath(`/customers/${customerId}`);
  return {};
}

export async function deletePromoCode(
  id: string,
  customerId: string,
  _prev: PromoCodeFormState,
  _formData: FormData
): Promise<PromoCodeFormState> {
  await requirePermission(PERMISSIONS.CUSTOMERS_WRITE);

  await db.promoCode.delete({ where: { id } }).catch(() => null);

  revalidatePath(`/customers/${customerId}`);
  return {};
}

export type ApplyPromoCodeState = { discountPercent?: number; title?: string; error?: string };

// Live "Apply" preview on the cart page — customer-facing, not admin. Reuses
// getValidPromoCode() so this can never say a code is valid when checkout
// would actually reject it (or vice versa).
export async function applyPromoCode(
  _prev: ApplyPromoCodeState,
  formData: FormData
): Promise<ApplyPromoCodeState> {
  const customer = await getCustomerSession();
  if (!customer) return { error: "Sign in to your account to use a promo code." };

  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "Enter a promo code." };

  const promo = await getValidPromoCode(code, customer.id);
  if (!promo) return { error: "That code isn't valid, has expired, or isn't linked to your account." };

  return { discountPercent: promo.discountPercent, title: promo.code };
}

export async function deleteCustomer(
  id: string,
  _prev: CustomerFormState,
  _formData: FormData
): Promise<CustomerFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.customer.delete({ where: { id } });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2003") {
      return { error: "Can't delete — this customer has existing sales orders." };
    }
    return { error: "Failed to delete customer." };
  }

  revalidatePath("/customers");
  redirect("/customers");
}
