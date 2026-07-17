import type { NextAuthConfig } from "next-auth";

// Edge-safe config used by middleware.ts (no Prisma — can't run on the Edge runtime).
// The full Node/Prisma-backed config lives in lib/auth.ts.
export default {
  pages: { signIn: "/login", error: "/error" },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
