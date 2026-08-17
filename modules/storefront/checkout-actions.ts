"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { notifyAdmins } from "@/lib/whatsapp";
import { notifyAdminsByEmail, orderNotificationEmailHtml } from "@/lib/email";
import { ADMIN_URL } from "@/lib/site-config";
import { gstComponent, applyDiscount } from "@/lib/storefront/gst";
import { getCustomerSession } from "@/lib/customer-auth";
import { checkoutSchema, checkoutLineSchema } from "@/modules/storefront/schema";
import { getBestActiveDiscount } from "@/modules/storefront/queries";
import { getValidPromoCode } from "@/modules/customers/queries";
import { quoteDelivery, type DeliveryQuote } from "@/lib/storefront/delivery";

// Called directly from CartView (a client component) as the address/subtotal
// change, for the live "FREE DELIVERY" / "$X delivery" preview — same
// quoteDelivery() the real charge below uses, so the preview can never show
// a different number than what checkout actually charges.
export async function getDeliveryQuoteAction(
  address: string,
  subtotal: number,
  location?: { suburb?: string; postcode?: string }
): Promise<DeliveryQuote> {
  return quoteDelivery(address, subtotal, location);
}

// An unauthenticated entry point — re-derives everything from the database
// (prices, stock status, discount eligibility) and never trusts a
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

  const rawSubtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  // Needed before the discount is resolved below (a promo code only redeems
  // against the account it was issued to), as well as for the existing
  // customer-linking logic further down.
  const loggedInCustomer = await getCustomerSession();

  // A customer-entered promo code (see PromoCode/getValidPromoCode()) is
  // checked first and, if valid, overrides — never stacks with — the
  // sitewide/spend-tier Promotion discount; only a signed-in customer can
  // redeem one, and only the specific code issued to their own account.
  // Falls back to the normal auto-applied best-tier discount otherwise.
  // `subtotal`/`total` below are POST-discount so every existing Finance
  // report keeps working unchanged; discountAmount/discountPercent record
  // what actually happened.
  let discountPercent: number | null;
  if (parsed.data.promoCode) {
    if (!loggedInCustomer) {
      return { error: "Sign in to your account to use a promo code." };
    }
    const promo = await getValidPromoCode(parsed.data.promoCode, loggedInCustomer.id);
    if (!promo) {
      return { error: "That promo code isn't valid, has expired, or isn't linked to your account." };
    }
    discountPercent = promo.discountPercent;
  } else {
    const activeDiscount = await getBestActiveDiscount(rawSubtotal);
    discountPercent = activeDiscount?.discountPercent ?? null;
  }
  const discountAmount = discountPercent ? applyDiscount(rawSubtotal, discountPercent) : 0;
  const subtotal = rawSubtotal - discountAmount;

  // The authoritative delivery quote — never trusts whatever fee the client
  // preview showed. An address beyond the configured delivery radius (e.g.
  // Dhanu's 40km cutoff) hard-blocks checkout, since that's a deliberate
  // "we don't deliver there" business rule; a geocoding/config hiccup
  // ("unknown") does not — the order proceeds with a $0 delivery fee and a
  // note for staff to confirm the real fee manually.
  const deliveryQuote = await quoteDelivery(parsed.data.shippingAddress, subtotal, {
    suburb: parsed.data.deliverySuburb,
    postcode: parsed.data.deliveryPostcode,
  });
  if (deliveryQuote.status === "out_of_range") {
    return {
      error: `Sorry, that address is outside our delivery area (we deliver up to ${deliveryQuote.maxKm}km). Please check the address or contact us directly.`,
    };
  }
  const deliveryFee = deliveryQuote.status === "charged" ? deliveryQuote.fee : 0;
  const deliveryFeeReason = deliveryQuote.status === "free" ? deliveryQuote.reason : deliveryQuote.status === "charged" ? deliveryQuote.zoneLabel : null;

  const total = subtotal + deliveryFee;
  const gstAmount = gstComponent(total);

  // A signed-in customer's own account record is authoritative — skip the
  // email-lookup path entirely so their order always links to the account
  // they're logged into, not whatever the checkout form's email happens to
  // match. Guest checkout (no session) keeps the existing email-match
  // behavior unchanged.
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
  if (deliveryQuote.status === "unknown") {
    notesParts.push(`⚠ Delivery fee could not be calculated automatically (${deliveryQuote.reason}) — confirm with customer.`);
  }

  const order = await db.salesOrder.create({
    data: {
      customerId: customer.id,
      // Snapshot of what was actually typed at checkout for THIS order —
      // separate from Customer.shippingAddress, which only gets backfilled
      // above when blank. A returning customer entering a different
      // delivery address (gift, new address, etc.) needs it recorded on the
      // order itself, not silently discarded in favor of their old address
      // on file. Also used as the default Shipment.deliveryAddress (see
      // modules/shipping/actions.ts createShipment).
      shippingAddress: parsed.data.shippingAddress,
      notes: notesParts.join(" "),
      subtotal,
      total,
      gstAmount,
      discountPercent,
      discountAmount: discountAmount > 0 ? discountAmount : null,
      deliveryFee: deliveryFee > 0 ? deliveryFee : null,
      deliveryFeeReason,
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

  // Notifies the moment an order is placed, independent of whether Stripe
  // payment ever completes — Stripe isn't fully configured yet, so this is
  // currently the only "an order came in" signal. Awaited (not fire-and-
  // forget) since a serverless function can be frozen right after this
  // action returns/redirects; a delivery failure is logged but never blocks
  // checkout itself.
  if (process.env.ADMIN_WHATSAPP_NUMBER) {
    try {
      const orderNumber = `SO-${String(order.seq).padStart(4, "0")}`;
      const message =
        `🛒 New order ${orderNumber} from ${customer.name} — $${Number(order.total).toFixed(2)} AUD (payment pending)\n` +
        `${ADMIN_URL}/sales-orders/${order.id}`;
      const results = await notifyAdmins(message);
      for (const r of results) {
        if (!r.sent) console.error("Order-placed WhatsApp notification not sent to", r.to, ":", r.error);
      }
    } catch (err) {
      console.error("Failed to send order-placed WhatsApp notification", err);
    }
  }

  try {
    const orderNumber = `SO-${String(order.seq).padStart(4, "0")}`;
    const emailResults = await notifyAdminsByEmail(
      `New order ${orderNumber} — $${Number(order.total).toFixed(2)} AUD`,
      orderNotificationEmailHtml({
        orderNumber,
        customerName: customer.name,
        total: Number(order.total),
        orderUrl: `${ADMIN_URL}/sales-orders/${order.id}`,
        paid: false,
      })
    );
    for (const r of emailResults) {
      if (!r.sent) console.error("Order-placed email not sent to", r.to, ":", r.error);
    }
  } catch (err) {
    console.error("Failed to send order-placed email", err);
  }

  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const host = headerList.get("host");
  const origin = `${proto}://${host}`;

  let checkoutUrl: string | null;
  try {
    // A fresh Stripe Coupon per checkout (rather than scaling down each line
    // item's unit_amount) — Stripe applies the percentage to the line-item
    // total itself, so there's no per-line cent-rounding drift to reconcile
    // against our own discountAmount calculation above.
    let stripeCouponId: string | undefined;
    if (discountPercent) {
      const coupon = await getStripe().coupons.create({ percent_off: discountPercent, duration: "once" });
      stripeCouponId = coupon.id;
    }

    const deliveryLineItem =
      deliveryFee > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "aud",
                // The coupon above is percent-off-the-whole-session in
                // Stripe, so it would otherwise also shave the delivery fee
                // — grossing this line up by the same percentage first
                // means Stripe's coupon nets it back down to exactly
                // `deliveryFee`, matching order.total above to the cent.
                unit_amount: Math.round((discountPercent ? deliveryFee / (1 - discountPercent / 100) : deliveryFee) * 100),
                product_data: { name: "Delivery" },
              },
            },
          ]
        : [];

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: [
        ...lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "aud",
            unit_amount: Math.round(line.unitPrice * 100),
            product_data: { name: line.name },
          },
        })),
        ...deliveryLineItem,
      ],
      ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
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
