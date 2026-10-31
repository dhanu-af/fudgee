import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";
import { MODULE_REGISTRY } from "@/lib/registry/modules";
import { SITE_URL, ADMIN_URL, ADMIN_HOST, STOREFRONT_CLOSED } from "@/lib/site-config";

const { auth } = NextAuth(authConfig);

const DASHBOARD_PREFIXES = ["/dashboard", ...MODULE_REGISTRY.map((m) => m.route)];
// Staff-only utility pages that sit outside the module registry but must
// still only ever live on the admin subdomain.
const STAFF_UTILITY_PATHS = ["/login", "/change-password", "/unauthorized", "/error"];

const ALWAYS_OPEN_PATHS = ["/robots.txt", "/sitemap.xml"];

function isStaffPath(pathname: string) {
  if (STAFF_UTILITY_PATHS.includes(pathname)) return true;
  return DASHBOARD_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default auth((req) => {
  const host = req.headers.get("host") ?? "";
  const isAdminHost = host === ADMIN_HOST || host.startsWith(`${ADMIN_HOST}:`);
  const { pathname, search } = req.nextUrl;

  // Two audiences, two subdomains: fudgee.au for shoppers, admin.fudgee.au
  // for staff. Redirect (not rewrite) so the address bar always matches
  // which app is actually being used — this is the only place that
  // decides which host a given path belongs on.
  if (isAdminHost) {
    if (pathname === "/") {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (!isStaffPath(pathname)) {
      return Response.redirect(new URL(pathname + search, SITE_URL));
    }
  } else if (isStaffPath(pathname)) {
    return Response.redirect(new URL(pathname + search, ADMIN_URL));
  }

  // Temporary closure — only ever the shopper-facing host (staff paths were
  // already redirected away above, the admin host is skipped here). 503 +
  // Retry-After tells search engines it's a pause, not a removal, so rankings
  // survive; no-store keeps browsers/CDN from holding the closed page after
  // reopening. robots/sitemap stay readable on purpose: a 5xx robots.txt makes
  // Google stop crawling the whole site, which is worse than a paused one.
  if (STOREFRONT_CLOSED && !isAdminHost && !ALWAYS_OPEN_PATHS.includes(pathname)) {
    return NextResponse.rewrite(new URL("/maintenance", req.nextUrl), {
      status: 503,
      headers: { "Retry-After": "3600", "Cache-Control": "no-store" },
    });
  }

  if (isStaffPath(pathname) && pathname !== "/login" && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
