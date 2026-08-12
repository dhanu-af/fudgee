import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getStorefrontSettings } from "@/modules/storefront/queries";

export const metadata: Metadata = {
  title: "Complaints",
  description: "How to raise a complaint with Fudgee, what to include, and what happens next.",
  alternates: { canonical: `${SITE_URL}/complaints` },
};

export default async function ComplaintsPage() {
  const settings = await getStorefrontSettings();
  const email = settings?.contactEmail || "the email address in our footer";
  const phone = settings?.contactPhone || "the phone number in our footer";

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Complaints</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <p>
          We&apos;d rather hear about a problem than have you leave unhappy. Here&apos;s how to raise a complaint
          and what to expect.
        </p>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">How to complain</h2>
          <p className="mt-2">
            Contact us directly using the email or phone number below, or through the contact form on our website.
            We handle every complaint personally rather than through an automated system.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Email / phone</h2>
          <p className="mt-2">
            Email: {email}
            <br />
            Phone: {phone}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">What to include</h2>
          <p className="mt-2">Please include, where relevant:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your order number</li>
            <li>The name and email/phone used on the order</li>
            <li>The date you placed and/or received the order</li>
            <li>A description of the issue</li>
            <li>Photos, if the complaint is about a product or its condition on arrival</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Expected response time</h2>
          <p className="mt-2">
            We aim to respond to every complaint within 2 business days, and to resolve most complaints within 7
            business days. If a resolution needs more time — for example while we look into what happened with a
            delivery — we&apos;ll keep you updated.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Escalation</h2>
          <p className="mt-2">
            If you&apos;re not satisfied with how we&apos;ve handled your complaint, let us know and we&apos;ll
            review it again. If it&apos;s still not resolved, you can contact the{" "}
            <a href="https://www.qld.gov.au/law/fair-trading" className="text-[var(--sf-primary)] underline">
              Queensland Office of Fair Trading
            </a>{" "}
            or the{" "}
            <a
              href="https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought"
              className="text-[var(--sf-primary)] underline"
            >
              ACCC
            </a>{" "}
            for independent advice on your consumer rights.
          </p>
        </section>
      </div>
    </div>
  );
}
