import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import logo from "@/public/logo.png";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { STOREFRONT_CLOSED } from "@/lib/site-config";

export const metadata: Metadata = { title: "Back soon | Fudgee" };

// Reached only via the middleware rewrite while STOREFRONT_CLOSED is true
// (which is what supplies the 503) — once the site reopens, a direct visit
// here is a 404 rather than a stray "we're closed" page on an open site.
export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  if (!STOREFRONT_CLOSED) notFound();

  // Best-effort: this page has to render even when the database is the very
  // reason the site is down, so contact details are a bonus, not a dependency.
  let settings: Awaited<ReturnType<typeof getStorefrontSettings>> | null = null;
  try {
    settings = await getStorefrontSettings();
  } catch {
    // fall through with no contact details
  }
  const whatsappDigits = settings?.whatsappNumber?.replace(/[^\d]/g, "");

  return (
    <div className="storefront flex min-h-screen items-center justify-center px-5 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="w-full rounded-3xl bg-[var(--sf-primary)] px-8 py-10">
          <Image src={logo} alt="fudgee." priority className="mx-auto h-24 w-auto" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            We&apos;re taking a short break
          </h1>
          <p className="text-[var(--sf-muted)]">
            Fudgee is temporarily closed for orders. We&apos;ll be back soon — thank you for your patience and for
            supporting a small Gold Coast business.
          </p>
        </div>

        {(settings?.contactEmail || settings?.contactPhone || whatsappDigits) && (
          <div className="flex w-full flex-col gap-3 rounded-3xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)]">
            <p className="text-sm font-semibold text-[var(--sf-fg)]">Already ordered, or have a question?</p>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--sf-fg)]/90">
              {settings?.contactEmail && (
                <li className="flex items-center justify-center gap-2.5">
                  <Mail className="size-4 text-[var(--sf-primary-foreground)]" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:underline">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center justify-center gap-2.5">
                  <Phone className="size-4 text-[var(--sf-primary-foreground)]" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:underline">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {whatsappDigits && (
                <li className="flex items-center justify-center gap-2.5">
                  <MessageCircle className="size-4 text-[var(--sf-primary-foreground)]" />
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
