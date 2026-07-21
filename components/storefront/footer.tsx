import Link from "next/link";
import { Camera, Share2, Music2, Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/storefront/newsletter-form";

type StorefrontSettings = {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  newsletterHeading: string | null;
  newsletterSubheading: string | null;
} | null;

export function StorefrontFooter({ settings }: { settings: StorefrontSettings }) {
  return (
    <footer className="bg-[var(--sf-fg)] text-[var(--sf-bg)]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start gap-6 border-b border-white/15 pb-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {settings?.newsletterHeading || "Sweeten your inbox"}
            </h2>
            <p className="mt-1 max-w-md text-sm text-white/70">
              {settings?.newsletterSubheading ||
                "New flavours, seasonal boxes, and the occasional treat — straight to your inbox."}
            </p>
          </div>
          <NewsletterForm variant="dark" />
        </div>

        <div className="grid gap-10 sm:grid-cols-2 pt-10 lg:grid-cols-4">
          <div>
            <div className="font-display text-xl font-semibold text-[var(--sf-primary-soft)]">fudgee.</div>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              Small-batch, handcrafted fudge and confections — made with love, delivered with care.
            </p>
            {(settings?.instagramUrl || settings?.facebookUrl || settings?.tiktokUrl) && (
              <div className="mt-4 flex gap-3">
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Camera className="size-4" />
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Share2 className="size-4" />
                  </a>
                )}
                {settings?.tiktokUrl && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Music2 className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Explore</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
              <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link href="/#gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/login" className="hover:text-white">Staff Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Contact</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
              {settings?.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">{settings.contactEmail}</a>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white">{settings.contactPhone}</a>
                </li>
              )}
              {settings?.contactAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Legal</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/50">© {new Date().getFullYear()} Fudgee. All rights reserved.</p>
      </div>
    </footer>
  );
}
