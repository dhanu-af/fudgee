import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, ADMIN_HOST } from "@/lib/site-config";

// Reads the request host so the two subdomains get different rules: the
// storefront allows its real public pages, the admin subdomain is blocked
// outright. Even though staff-only paths now redirect away from the
// storefront host entirely (see middleware.ts), the allowlist below stays as
// a second layer of protection — cheap insurance against a future path that
// forgets to redirect.
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";

  if (host === ADMIN_HOST || host.startsWith(`${ADMIN_HOST}:`)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/$", "/shop", "/shop/", "/terms", "/privacy", "/cookies"],
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
