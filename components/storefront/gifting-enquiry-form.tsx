"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessage } from "@/modules/storefront/public-actions";

const SEED_MESSAGE =
  "Hi Fudgee team — I'm enquiring about a corporate/gifting order.\n\nOccasion: \nQuantity: \nDelivery date needed by: \n";

// Reuses the existing contact-message pipeline (same admin inbox, same
// WhatsApp/email notification to Dhanu) rather than a dedicated schema —
// there's no "enquiry type" field to set, so the seeded message template
// below carries that context in plain text instead.
export function GiftingEnquiryForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-3xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gifting-name" className="text-sm font-medium text-[var(--sf-fg)]">
            Name
          </label>
          <input
            id="gifting-name"
            name="name"
            required
            className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gifting-email" className="text-sm font-medium text-[var(--sf-fg)]">
            Email
          </label>
          <input
            id="gifting-email"
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="gifting-phone" className="text-sm font-medium text-[var(--sf-fg)]">
          Phone (optional)
        </label>
        <input
          id="gifting-phone"
          name="phone"
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="gifting-message" className="text-sm font-medium text-[var(--sf-fg)]">
          Tell us about your order
        </label>
        <textarea
          id="gifting-message"
          name="message"
          required
          rows={7}
          defaultValue={SEED_MESSAGE}
          className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-[var(--sf-primary)]">Thanks — we&apos;ll be in touch soon to confirm the details!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
