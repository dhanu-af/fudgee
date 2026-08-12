import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getStorefrontSettings } from "@/modules/storefront/queries";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "Fudgee's delivery areas, fees, dispatch times, and what to do about delivery issues.",
  alternates: { canonical: `${SITE_URL}/shipping-policy` },
};

const NOT_SET = "Contact us for current details.";

export default async function ShippingPage() {
  const settings = await getStorefrontSettings();
  const email = settings?.contactEmail || "the email address in our footer";
  const phone = settings?.contactPhone || "the phone number in our footer";

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Shipping &amp; Delivery</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Delivery areas</h2>
          <p className="mt-2">{settings?.deliveryAreas || NOT_SET}</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Delivery fee</h2>
          <p className="mt-2">{settings?.deliveryFee || NOT_SET}</p>
        </section>

        {settings?.freeDeliveryThreshold && (
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Free delivery</h2>
            <p className="mt-2">{settings.freeDeliveryThreshold}</p>
          </section>
        )}

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Dispatch time</h2>
          <p className="mt-2">{settings?.dispatchTime || NOT_SET}</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Estimated delivery time</h2>
          <p className="mt-2">{settings?.estimatedDeliveryTime || NOT_SET}</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Courier</h2>
          <p className="mt-2">{settings?.courierName || NOT_SET}</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Tracking</h2>
          <p className="mt-2">
            Once your order is dispatched, we&apos;ll let you know so you can expect its arrival. If your order
            has an account, you can also check its status any time from your Account page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Incorrect address</h2>
          <p className="mt-2">
            Please double-check your delivery address at checkout — we dispatch to the address you provide. If a
            parcel is returned to us because the address supplied was incomplete or incorrect, we&apos;ll contact
            you to arrange redelivery, which may involve an additional delivery fee.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Failed delivery</h2>
          <p className="mt-2">
            If a delivery attempt is unsuccessful, the courier will generally leave a card with instructions for
            redelivery or collection. Contact us if you&apos;re unsure what to do or haven&apos;t heard from the
            courier within a few days of the expected delivery date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Damaged or lost parcel</h2>
          <p className="mt-2">
            If your parcel arrives damaged, or doesn&apos;t arrive at all, contact us — this is covered by your
            rights under the Australian Consumer Law, and we&apos;ll sort out a replacement or refund. See our{" "}
            <a href="/refunds" className="text-[var(--sf-primary)] underline">
              Refund &amp; Returns Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Public holiday delays</h2>
          <p className="mt-2">
            Dispatch and delivery times may be a little longer around public holidays and long weekends, since
            couriers and our own kitchen both run on reduced schedules. We&apos;ll let you know if this affects
            your order.
          </p>
        </section>

        <p>
          Questions about a delivery? Contact us at {email} or {phone}.
        </p>
      </div>
    </div>
  );
}
