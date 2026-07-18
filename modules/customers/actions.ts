"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { customerSchema } from "@/modules/customers/schema";

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
