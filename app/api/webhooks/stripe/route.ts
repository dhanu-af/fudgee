import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { notifyAdmins } from "@/lib/whatsapp";
import { ADMIN_URL } from "@/lib/site-config";

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
      const order = await db.salesOrder.findUnique({
        where: { id: salesOrderId },
        include: { customer: true },
      });
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

        // Rewards: 1 point per dollar of subtotal. Separately idempotent via
        // RewardsLedgerEntry's unique salesOrderId — belt-and-suspenders
        // alongside the paymentStatus check above, in case this handler is
        // ever reached a second time some other way.
        const points = Math.floor(Number(order.subtotal));
        if (points > 0) {
          try {
            await db.$transaction([
              db.rewardsLedgerEntry.create({
                data: {
                  customerId: order.customerId,
                  points,
                  reason: `Order SO-${String(order.seq).padStart(4, "0")}`,
                  salesOrderId: order.id,
                },
              }),
              db.customer.update({
                where: { id: order.customerId },
                data: { rewardsPoints: { increment: points } },
              }),
            ]);
          } catch {
            // Unique constraint on salesOrderId hit — already awarded.
          }
        }

        // Awaited (not fire-and-forget) since a serverless function can be
        // frozen the instant this handler returns, which would cut off an
        // in-flight fetch. A delivery failure is logged but never blocks the
        // order itself from being confirmed and paid.
        if (process.env.ADMIN_WHATSAPP_NUMBER) {
          try {
            const orderNumber = `SO-${String(order.seq).padStart(4, "0")}`;
            const message =
              `🛒 New order ${orderNumber} from ${order.customer.name} — $${Number(order.total).toFixed(2)} AUD\n` +
              `${ADMIN_URL}/sales-orders/${order.id}`;
            const results = await notifyAdmins(message);
            for (const r of results) {
              if (!r.sent) console.error("Order notification WhatsApp message not sent to", r.to, ":", r.error);
            }
          } catch (err) {
            console.error("Failed to send order notification via WhatsApp", err);
          }
        }

        revalidatePath("/sales-orders");
        revalidatePath("/account");
      }
    }
  }

  return NextResponse.json({ received: true });
}
