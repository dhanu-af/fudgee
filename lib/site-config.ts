// Single source of truth for the public storefront's canonical domain — used
// by metadataBase, sitemap.ts, robots.ts, and every canonical/OG URL, so the
// domain is never hardcoded in more than one place.
export const SITE_URL = "https://fudgee.au";
export const SITE_NAME = "Fudgee";

// The internal ops dashboard's own subdomain — kept separate from the public
// storefront domain above (see middleware.ts, which redirects staff-only
// paths here and storefront-only paths back to SITE_URL).
export const ADMIN_URL = "https://admin.fudgee.au";
export const ADMIN_HOST = "admin.fudgee.au";
