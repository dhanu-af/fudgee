"use client";

import { useActionState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";
import { submitContactMessage } from "@/modules/storefront/public-actions";

type StorefrontSettings = {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
} | null;

export function ContactSection({ settings }: { settings: StorefrontSettings }) {
  const [state, formAction, pending] = useActionState(submitContactMessage, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <section id="contact" className="bg-[var(--sf-bg-alt)] py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Get in touch</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
              We&apos;d love to hear from you
            </h2>
          </div>
          <ul className="flex flex-col gap-3 text-[var(--sf-fg)]/90">
            {settings?.contactEmail && (
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-[var(--sf-primary)]" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:underline">{settings.contactEmail}</a>
              </li>
            )}
            {settings?.contactPhone && (
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-[var(--sf-primary)]" />
                <a href={`tel:${settings.contactPhone}`} className="hover:underline">{settings.contactPhone}</a>
              </li>
            )}
            {settings?.contactAddress && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--sf-primary)]" />
                <span>{settings.contactAddress}</span>
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form ref={formRef} action={formAction} className="flex flex-col gap-4 rounded-3xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium text-[var(--sf-fg)]">Name</label>
              <input
                id="contact-name"
                name="name"
                required
                className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-[var(--sf-fg)]">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-phone" className="text-sm font-medium text-[var(--sf-fg)]">Phone (optional)</label>
              <input
                id="contact-phone"
                name="phone"
                className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-[var(--sf-fg)]">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--sf-primary)]"
              />
            </div>

            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            {state.success && <p className="text-sm text-[var(--sf-primary)]">Thanks — we&apos;ll be in touch soon!</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-60"
            >
              {pending ? "Sending..." : "Send message"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
