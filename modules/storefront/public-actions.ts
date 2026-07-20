"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  checkoutSchema,
  checkoutLineSchema,
  contactMessageSchema,
  newsletterSignupSchema,
} from "@/modules/storefront/schema";
import { z } from "zod";

// Every action in this file is called by an unauthenticated site visitor —
// there is no permission check to fall back on, so input is validated
// strictly and nothing here ever trusts client-submitted prices or product
// data beyond an id to look up.

export type CheckoutFormState = { error?: string; orderNumber?: number };

export async function submitOrder(_prev: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  let rawLines: unknown;
  try {
    rawLines = JSON.parse(parsed.data.linesJson);
  } catch {
    return { error: "Your cart looks invalid — please refresh and try again." };
  }
  const linesParsed = z.array(checkoutLineSchema).min(1, "Your cart is empty.").safeParse(rawLines);
  if (!linesParsed.success) {
    return { error: linesParsed.error.issues[0]?.message ?? "Your cart looks invalid — please refresh and try again." };
  }

  // Re-price every line from the database — never trust a price the client
  // sent, and never let a hidden/non-finished-good product slip through.
  const productIds = [...new Set(linesParsed.data.map((l) => l.productId))];
  const products = await db.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE", type: "FINISHED_GOOD" },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines: { productId: string; quantity: number; unitPrice: number; lineTotal: number }[] = [];
  for (const line of linesParsed.data) {
    const product = productMap.get(line.productId);
    if (!product || product.sellPrice === null) {
      return { error: "One or more items in your cart are no longer available — please refresh your cart." };
    }
    const unitPrice = Number(product.sellPrice);
    lines.push({ productId: product.id, quantity: line.quantity, unitPrice, lineTotal: unitPrice * line.quantity });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  let customer = await db.customer.findFirst({ where: { email: parsed.data.email } });
  if (!customer) {
    customer = await db.customer.create({
      data: {
        name: parsed.data.customerName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        shippingAddress: parsed.data.shippingAddress,
      },
    });
  } else if (!customer.shippingAddress || !customer.phone) {
    customer = await db.customer.update({
      where: { id: customer.id },
      data: {
        shippingAddress: customer.shippingAddress ?? parsed.data.shippingAddress,
        phone: customer.phone ?? parsed.data.phone,
      },
    });
  }

  const notesParts = ["Placed via website storefront."];
  if (parsed.data.notes) notesParts.push(`Customer note: ${parsed.data.notes}`);

  const order = await db.salesOrder.create({
    data: {
      customerId: customer.id,
      notes: notesParts.join(" "),
      subtotal,
      total: subtotal,
      lines: { create: lines },
    },
  });

  revalidatePath("/sales-orders");
  revalidatePath("/customers");

  return { orderNumber: order.seq };
}

export type ContactFormState = { error?: string; success?: boolean };

export async function submitContactMessage(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  await db.contactMessage.create({ data: parsed.data });
  revalidatePath("/storefront/messages");

  return { success: true };
}

export type NewsletterFormState = { error?: string; success?: boolean };

export async function submitNewsletterSignup(
  _prev: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const parsed = newsletterSignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a valid email." };
  }

  try {
    await db.newsletterSignup.create({ data: parsed.data });
  } catch {
    return { success: true }; // already subscribed — treat as success, no need to reveal that
  }
  revalidatePath("/storefront/newsletter");

  return { success: true };
}
