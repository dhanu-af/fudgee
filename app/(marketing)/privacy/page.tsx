import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Fudgee collects, uses, and protects your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <p>
          We collect the information you provide when placing an order,
          signing up for our newsletter, or contacting us — such as your name,
          email address, phone number, and delivery address.
        </p>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">How we use it</h2>
          <p className="mt-2">
            Your information is used to fulfil orders, respond to enquiries,
            and — only if you&apos;ve opted in — send occasional newsletter
            updates. We do not sell your personal information to third
            parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Your choices</h2>
          <p className="mt-2">
            You can unsubscribe from the newsletter at any time, and you can
            contact us to request that your information be updated or
            removed.
          </p>
        </section>
      </div>
    </div>
  );
}
