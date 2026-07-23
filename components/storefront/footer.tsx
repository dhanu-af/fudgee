import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { FacebookFanPageCard } from "@/components/storefront/facebook-fanpage-card";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899 3.644 3.644 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 1 1-2.883 0 1.441 1.441 0 0 1 2.883 0z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-1.12-1.08-1.67-2.64-1.75-4.17-1.3.01-2.6 0-3.91.02v14.65c0 .89-.32 1.79-.9 2.47-.71.85-1.79 1.4-2.91 1.41-1.68.15-3.26-1.23-3.5-2.87-.01-.54-.07-1.1.14-1.61.25-.71.73-1.34 1.36-1.75.87-.6 2.03-.69 3.02-.37 0-1.48.06-2.96.04-4.44-2.17-.41-4.49.28-6.15 1.72-1.46 1.24-2.4 3.06-2.58 4.96-.02.49-.01.99.01 1.49.21 2.34 1.63 4.52 3.65 5.71 1.22.72 2.65 1.11 4.08 1.03 2.33-.04 4.6-1.29 5.91-3.21.81-1.15 1.27-2.54 1.35-3.94.03-2.91.01-5.83.02-8.75.52.34 1.05.67 1.62.93 1.31.62 2.76.92 4.2.97V5.98c-1.54-.17-3.12-.68-4.24-1.79-.08-.08-.15-.15-.22-.23z" />
    </svg>
  );
}

type StorefrontSettings = {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  facebookFanPageUrl: string | null;
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

        {settings?.facebookFanPageUrl && (
          <div className="border-b border-white/15 py-10">
            <FacebookFanPageCard url={settings.facebookFanPageUrl} />
          </div>
        )}

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
                    <InstagramIcon className="size-4" />
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
                    <FacebookIcon className="size-4" />
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
                    <TikTokIcon className="size-4" />
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
