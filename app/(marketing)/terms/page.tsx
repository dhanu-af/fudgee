import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Fudgee",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <p>
          Welcome to Fudgee. By using our website and placing an order, you
          agree to the terms below. If you have any questions, please contact
          us using the details in the footer.
        </p>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Orders</h2>
          <p className="mt-2">
            Placing an order through our site submits an order request for us
            to confirm — it does not charge payment automatically. We&apos;ll
            follow up with you directly to arrange payment and delivery.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Content</h2>
          <p className="mt-2">
            Product descriptions, images, and pricing are provided in good
            faith and may change without notice. Reviews submitted through the
            site are moderated before publishing.
          </p>
        </section>
      </div>
    </div>
  );
}
