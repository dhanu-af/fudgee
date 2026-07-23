import { Fredoka } from "next/font/google";
import type { Metadata } from "next";
import { CartProvider } from "@/lib/storefront/cart-context";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { getCustomerSession } from "@/lib/customer-auth";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });

const DEFAULT_DESCRIPTION =
  "Small-batch, handcrafted fudge and confections made with real cream and real butter. Shop online for Australia-wide delivery.";

// Site-wide defaults for every storefront page — individual pages (home,
// shop, product detail, etc.) override title/description/openGraph as
// needed; anything they don't override falls back to these.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStorefrontSettings();

  return {
    title: { default: `${SITE_NAME} — Handcrafted Fudge & Confections`, template: `%s | ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: "en_AU",
      images: settings?.heroImageUrl ? [{ url: settings.heroImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [settings, customer] = await Promise.all([getStorefrontSettings(), getCustomerSession()]);

  // Present on every public page so search engines have a consistent brand
  // identity signal (name, logo, contact info, social profiles) regardless
  // of which page was the entry point.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    ...(settings?.heroImageUrl ? { logo: settings.heroImageUrl } : {}),
    ...(settings?.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings?.contactPhone ? { telephone: settings.contactPhone } : {}),
    ...(settings?.contactAddress ? { address: settings.contactAddress } : {}),
    sameAs: [settings?.instagramUrl, settings?.facebookUrl, settings?.tiktokUrl].filter(
      (url): url is string => !!url
    ),
  };

  return (
    <div className={`storefront ${fredoka.variable} flex min-h-screen flex-col`}>
      <JsonLd data={organizationJsonLd} />
      <CartProvider>
        <StorefrontHeader customerName={customer?.name} />
        <main className="flex-1">{children}</main>
        <StorefrontFooter settings={settings} />
      </CartProvider>
    </div>
  );
}
