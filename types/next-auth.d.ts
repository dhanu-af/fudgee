import type { DefaultSession } from "next-auth";

// next-auth/@auth-core re-export types from @auth/core; augmentation must target
// the modules where the interfaces are actually declared for it to merge.
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      roleKey: string;
      permissions: string[];
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    roleKey: string;
    permissions: string[];
    mustChangePassword: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    roleKey: string;
    permissions: string[];
    mustChangePassword: boolean;
  }
}
