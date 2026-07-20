import type { Session } from "next-auth";
import { SUPER_ADMIN_ROLE_KEY, type PermissionKey } from "@/lib/rbac/permissions";

export function can(session: Session | null, permission: PermissionKey): boolean {
  return !!session?.user?.permissions?.includes(permission);
}

export function isSuperAdmin(session: Session | null): boolean {
  return session?.user?.roleKey === SUPER_ADMIN_ROLE_KEY;
}
