"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitNewsletterSignup } from "@/modules/storefront/public-actions";

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [state, formAction, pending] = useActionState(submitNewsletterSignup, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const inputClasses =
    variant === "dark"
      ? "border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
      : "border-[var(--sf-border)] bg-[var(--sf-card)] text-[var(--sf-fg)] placeholder:text-[var(--sf-muted)] focus:border-[var(--sf-primary)]";

  return (
    <form ref={formRef} action={formAction} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className={`h-11 flex-1 rounded-full border px-4 text-sm outline-none transition-colors ${inputClasses}`}
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 shrink-0 rounded-full bg-[var(--sf-accent)] px-6 text-sm font-semibold text-[var(--sf-accent-foreground)] transition-transform hover:scale-105 disabled:opacity-60"
      >
        {pending ? "Joining..." : "Subscribe"}
      </button>
      {state.error && <p className="text-xs text-red-500 sm:absolute sm:mt-12">{state.error}</p>}
      {state.success && <p className="text-xs text-current sm:absolute sm:mt-12">You&apos;re on the list!</p>}
    </form>
  );
}
