import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getStorefrontSettings } from "@/modules/storefront/queries";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description: "Fudgee's refund and returns policy, including your rights under Australian Consumer Law.",
  alternates: { canonical: `${SITE_URL}/refunds` },
};

export default async function RefundsPage() {
  const settings = await getStorefrontSettings();
  const email = settings?.contactEmail || "the email address in our footer";
  const phone = settings?.contactPhone || "the phone number in our footer";

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Refund &amp; Returns Policy</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      {settings?.legalBusinessName && (
        <p className="mt-1 text-sm text-[var(--sf-fg)]/60">
          Issued by {settings.legalBusinessName}
          {settings.abn && ` (ABN ${settings.abn})`}
        </p>
      )}
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <p>
          We want you to be happy with every order. This page explains what to do if something isn&apos;t right,
          and how it fits together with your rights under the Australian Consumer Law (ACL) — nothing on this page
          limits or takes away those rights.
        </p>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Damaged product</h2>
          <p className="mt-2">
            If your order arrives damaged, contact us within 48 hours of delivery with a photo of the damaged item
            and its packaging. We&apos;ll send a free replacement or a full refund for the affected item — your
            choice — at no cost to you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Incorrect product</h2>
          <p className="mt-2">
            If we&apos;ve sent you the wrong item, let us know and we&apos;ll send the correct product free of
            charge and arrange return of the incorrect item at our cost. You won&apos;t be left out of pocket.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Missing product</h2>
          <p className="mt-2">
            If part of your order is missing, contact us with your order number and we&apos;ll send the missing
            item as soon as possible, or refund that part of your order if you&apos;d prefer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Faulty or problem product</h2>
          <p className="mt-2">
            If a product has a fault or doesn&apos;t match its description, the remedy depends on how serious the
            problem is. For a minor issue, we&apos;ll offer a free replacement. For a major problem — for example,
            the product is unsafe, significantly different from what was described, or can&apos;t reasonably be
            fixed — you can choose between a full refund or a replacement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Cancellation</h2>
          <p className="mt-2">
            Because our fudge is handmade in small batches and orders are often prepared quickly, we can only
            cancel an order if it hasn&apos;t yet been confirmed or dispatched. Contact us as soon as possible if
            you need to cancel — we&apos;ll always try to help if production hasn&apos;t started yet.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Change of mind</h2>
          <p className="mt-2">
            Simply changing your mind isn&apos;t something the ACL requires us to refund, and because our products
            are handmade, perishable food, we&apos;re not able to accept change-of-mind returns once an order has
            been dispatched or delivered. This doesn&apos;t affect your rights above for anything damaged,
            incorrect, missing, or faulty.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Refund method</h2>
          <p className="mt-2">
            Approved refunds are returned to the original payment method used at checkout. We&apos;re not able to
            issue refunds to a different card or account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Refund processing</h2>
          <p className="mt-2">
            We process approved refunds as soon as we can, usually within 2 business days of approval. Once
            processed, your bank or card provider may take a further 5–10 business days to show the funds in your
            account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Your rights under Australian Consumer Law</h2>
          <p className="mt-2">
            Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law.
            You&apos;re entitled to a replacement or refund for a major failure and for compensation for any other
            reasonably foreseeable loss or damage. You&apos;re also entitled to have goods repaired or replaced if
            they fail to be of acceptable quality and the failure doesn&apos;t amount to a major failure. Nothing in
            this policy overrides these rights. You can read more at{" "}
            <a
              href="https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees"
              className="text-[var(--sf-primary)] underline"
            >
              accc.gov.au
            </a>
            .
          </p>
        </section>

        <p>
          To start a refund, replacement, or repair request, contact us at {email} or {phone} with your order
          number and a description of the issue.
        </p>
      </div>
    </div>
  );
}
