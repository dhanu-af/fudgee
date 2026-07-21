import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ClearCartOnMount } from "@/components/storefront/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Payment received — Fudgee",
};

// Reads the order straight from our own DB rather than calling Stripe's API —
// the order row already exists (created before the redirect to Stripe), so
// this works even if the confirmation webhook hasn't landed yet. The webhook
// is still the only thing that ever marks the order PAID (see
// app/api/webhooks/stripe/route.ts) — this page is cosmetic only.
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const order = session_id
    ? await db.salesOrder.findUnique({ where: { stripeCheckoutSessionId: session_id } })
    : null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] text-3xl">
        🎉
      </span>
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Payment received!</h1>
      <p className="text-[var(--sf-muted)]">
        Thank you{order ? <> — your order <strong>#{order.seq}</strong></> : null} has been paid and sent through.
        We&apos;ll be in touch shortly to arrange delivery.
      </p>
      <Link
        href="/shop"
        className="mt-2 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)]"
      >
        Continue shopping
      </Link>
    </div>
  );
}
