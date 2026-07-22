import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// This is the only place a storefront order is ever marked PAID — the
// checkout success-page redirect is cosmetic only (a customer can close the
// tab before it fires), so nothing about the order's state depends on it.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature or secret" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const salesOrderId = session.metadata?.salesOrderId;

    if (salesOrderId) {
      const order = await db.salesOrder.findUnique({ where: { id: salesOrderId } });
      // Idempotent: Stripe retries webhook delivery, so skip if already applied.
      if (order && order.paymentStatus !== "PAID") {
        await db.salesOrder.update({
          where: { id: salesOrderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            paidAt: new Date(),
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          },
        });
        revalidatePath("/sales-orders");
      }
    }
  }

  return NextResponse.json({ received: true });
}
