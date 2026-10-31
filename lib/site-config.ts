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

// Temporary closure of the PUBLIC storefront ("we're taking a short break").
// While true, middleware.ts answers every shopper-facing page request with a
// 503 + Retry-After rendering /maintenance, so no new orders can be placed —
// but the admin subdomain, /api (Stripe webhook, auth) and robots/sitemap stay
// up, so staff keep working and payments already in flight still land.
// Flip to false and push to reopen.
export const STOREFRONT_CLOSED = true;

// Single global switch for the temporary site-update announcement banner.
// Flip to false to remove it everywhere without touching any other file.
export const SHOW_ANNOUNCEMENT_BANNER = false;
