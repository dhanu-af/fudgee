"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { gstComponent } from "@/lib/storefront/gst";
import { getCustomerSession } from "@/lib/customer-auth";
import { checkoutSchema, checkoutLineSchema } from "@/modules/storefront/schema";

// Mirrors the re-pricing/customer-upsert rules in submitOrder() in
// public-actions.ts — this is a second unauthenticated entry point, so it
// re-derives everything from the database the same way and never trusts a
// client-submitted price or product id.

export type StripeCheckoutFormState = { error?: string };

export async function createStripeCheckout(
  _prev: StripeCheckoutFormState,
  formData: FormData
): Promise<StripeCheckoutFormState> {
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

  const productIds = [...new Set(linesParsed.data.map((l) => l.productId))];
  const products = await db.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE", type: "FINISHED_GOOD" },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    unitCostAtSale: number | null;
  }[] = [];
  for (const line of linesParsed.data) {
    const product = productMap.get(line.productId);
    if (!product || product.sellPrice === null) {
      return { error: "One or more items in your cart are no longer available — please refresh your cart." };
    }
    const unitPrice = Number(product.sellPrice);
    lines.push({
      productId: product.id,
      name: product.name,
      quantity: line.quantity,
      unitPrice,
      lineTotal: unitPrice * line.quantity,
      // Snapshot for Finance's COGS/margin reporting — Product.costPrice can
      // change later, so this must be captured at sale time, not derived later.
      unitCostAtSale: product.costPrice !== null ? Number(product.costPrice) : null,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const gstAmount = gstComponent(subtotal);

  // A signed-in customer's own account record is authoritative — skip the
  // email-lookup path entirely so their order always links to the account
  // they're logged into, not whatever the checkout form's email happens to
  // match. Guest checkout (no session) keeps the existing email-match
  // behavior unchanged.
  const loggedInCustomer = await getCustomerSession();
  let customer = loggedInCustomer;
  if (!customer) {
    customer = await db.customer.findFirst({ where: { email: parsed.data.email } });
  }
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

  const notesParts = ["Placed via website storefront (Stripe checkout)."];
  if (parsed.data.notes) notesParts.push(`Customer note: ${parsed.data.notes}`);

  const order = await db.salesOrder.create({
    data: {
      customerId: customer.id,
      notes: notesParts.join(" "),
      subtotal,
      total: subtotal,
      gstAmount,
      lines: {
        create: lines.map(({ productId, quantity, unitPrice, lineTotal, unitCostAtSale }) => ({
          productId,
          quantity,
          unitPrice,
          lineTotal,
          unitCostAtSale,
        })),
      },
    },
  });

  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const host = headerList.get("host");
  const origin = `${proto}://${host}`;

  let checkoutUrl: string | null;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "aud",
          unit_amount: Math.round(line.unitPrice * 100),
          product_data: { name: line.name },
        },
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: { salesOrderId: order.id },
    });
    checkoutUrl = session.url;
    await db.salesOrder.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });
  } catch (err) {
    console.error("Failed to create Stripe checkout session", err);
    return { error: "We couldn't start checkout — please try again in a moment." };
  }

  if (!checkoutUrl) {
    return { error: "We couldn't start checkout — please try again in a moment." };
  }

  revalidatePath("/sales-orders");
  revalidatePath("/customers");

  redirect(checkoutUrl);
}
