import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// The internal ops dashboard shares this same app on the same domain — its
// routes are flat top-level paths (/sales-orders, /finance, /production,
// etc.), not grouped under one common prefix, so rather than enumerate every
// dashboard route, disallow everything by default and explicitly allow only
// the known public storefront paths. The more specific Allow rules win over
// the blanket Disallow (documented crawler precedence rule), matching the
// per-page `robots: { index: false }` already set on /(dashboard)/**,
// /(auth)/**, and /unauthorized as a second layer of protection.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/$", "/shop", "/shop/", "/terms", "/privacy", "/cookies"],
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
