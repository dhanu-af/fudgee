import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { ClearCartOnMount } from "@/components/storefront/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Order confirmed",
  // One customer's order confirmation — never indexable.
  robots: { index: false, follow: false },
};

// Reads the order straight from our own DB rather than calling Stripe's API —
// the order row already exists (created before the redirect to Stripe), so
// this works even if the confirmation webhook hasn't landed yet. The webhook
// is still the only thing that ever marks a Stripe order PAID (see
// app/api/webhooks/stripe/route.ts) — this page is cosmetic only. A
// cash/PayID order arrives here via order_id instead (no Stripe session
// exists for those at all — see submitCheckout in checkout-actions.ts).
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const { session_id, order_id } = await searchParams;
  const order = session_id
    ? await db.salesOrder.findUnique({ where: { stripeCheckoutSessionId: session_id } })
    : order_id
      ? await db.salesOrder.findUnique({ where: { id: order_id } })
      : null;

  const isManualPayment = order?.paymentMethod === "CASH" || order?.paymentMethod === "PAYID";
  const settings = isManualPayment ? await getStorefrontSettings() : null;
  const paymentInstructions =
    order?.paymentMethod === "PAYID" ? settings?.payIdDetails : order?.paymentMethod === "CASH" ? settings?.cashInstructions : null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] text-3xl">
        {order?.outOfDeliveryRange ? "📨" : "🎉"}
      </span>
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">
        {order?.outOfDeliveryRange ? "Request received!" : isManualPayment ? "Order placed!" : "Payment received!"}
      </h1>
      <p className="text-[var(--sf-muted)]">
        Thank you{order ? <> — your order <strong>#{order.seq}</strong></> : null}
        {order?.outOfDeliveryRange
          ? " is outside our standard delivery area, so we haven't charged anything yet. We'll contact you shortly to confirm whether delivery is possible and what it would cost."
          : isManualPayment
            ? ` has been placed. We'll contact you shortly to arrange ${order?.paymentMethod === "PAYID" ? "PayID" : "cash"} payment and delivery.`
            : " has been paid and sent through. We'll be in touch shortly to arrange delivery."}
      </p>
      {paymentInstructions && <p className="text-[var(--sf-muted)]">{paymentInstructions}</p>}
      <Link
        href="/shop"
        className="mt-2 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)]"
      >
        Continue shopping
      </Link>
    </div>
  );
}
