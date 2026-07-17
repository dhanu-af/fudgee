import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { MODULE_REGISTRY } from "@/lib/registry/modules";

const { auth } = NextAuth(authConfig);

const DASHBOARD_PREFIXES = ["/dashboard", ...MODULE_REGISTRY.map((m) => m.route)];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isDashboardRoute = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (isDashboardRoute && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
