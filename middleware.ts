import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { MODULE_REGISTRY } from "@/lib/registry/modules";
import { SITE_URL, ADMIN_URL, ADMIN_HOST } from "@/lib/site-config";

const { auth } = NextAuth(authConfig);

const DASHBOARD_PREFIXES = ["/dashboard", ...MODULE_REGISTRY.map((m) => m.route)];
// Staff-only utility pages that sit outside the module registry but must
// still only ever live on the admin subdomain.
const STAFF_UTILITY_PATHS = ["/login", "/change-password", "/unauthorized", "/error"];

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

  if (isStaffPath(pathname) && pathname !== "/login" && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
