import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Briefcase } from "lucide-react";
import { GiftingEnquiryForm } from "@/components/storefront/gifting-enquiry-form";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gifting & Corporate Orders",
  description:
    "Handcrafted fudge cookie boxes for gifting and corporate orders — build your own box or send us the details for a bulk order.",
  alternates: { canonical: `${SITE_URL}/gifting` },
};

const BOX_TIERS = [
  { size: 6, blurb: "A thoughtful gift for one — or a very good afternoon for yourself." },
  { size: 12, blurb: "Enough to share with a small team, or to make one person's week." },
  { size: 24, blurb: "For a real occasion — an office, a party, a proper thank-you." },
];

export default function GiftingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">
          Gifting &amp; Corporate
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-5xl">
          Handcrafted, boxed, and ready to give
        </h1>
        <p className="max-w-xl text-[var(--sf-muted)]">
          Whether it&apos;s one box for someone who deserves it or a bulk order for the whole office, every Fudgee
          is still made the same way — by hand, in small batches, on the Gold Coast.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/build-a-box"
            className="flex items-center gap-2 rounded-full bg-[var(--sf-primary)] px-7 py-3.5 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
          >
            <Gift className="size-4" />
            Build a Gift Box
          </Link>
          <a
            href="#corporate"
            className="flex items-center gap-2 rounded-full border border-[var(--sf-border)] bg-[var(--sf-card)] px-7 py-3.5 text-sm font-semibold text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
          >
            <Briefcase className="size-4" />
            Corporate &amp; Bulk Orders
          </a>
        </div>
      </div>

      <div className="mb-16 grid gap-5 sm:grid-cols-3">
        {BOX_TIERS.map((tier) => (
          <div
            key={tier.size}
            className="flex flex-col gap-3 rounded-3xl bg-[var(--sf-card)] p-6 text-center ring-1 ring-[var(--sf-border)]"
          >
            <span className="font-display text-3xl font-semibold text-[var(--sf-fg)]">{tier.size}-Pack</span>
            <p className="flex-1 text-sm text-[var(--sf-muted)]">{tier.blurb}</p>
            <Link
              href="/build-a-box"
              className="mt-1 rounded-full bg-[var(--sf-primary-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--sf-primary)] transition-colors hover:bg-[var(--sf-primary)] hover:text-[var(--sf-primary-foreground)]"
            >
              Build This Box
            </Link>
          </div>
        ))}
      </div>

      <div id="corporate" className="grid gap-10 scroll-mt-20 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-3xl">
            Ordering for a team, event, or client?
          </h2>
          <p className="text-[var(--sf-muted)]">
            For larger or time-sensitive orders, send us the details below rather than checking out online — we&apos;ll
            confirm quantity, pricing, and a delivery date with you directly before anything is locked in.
          </p>
        </div>
        <GiftingEnquiryForm />
      </div>
    </div>
  );
}
