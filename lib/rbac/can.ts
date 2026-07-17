import type { Session } from "next-auth";
import type { PermissionKey } from "@/lib/rbac/permissions";

export function can(session: Session | null, permission: PermissionKey): boolean {
  return !!session?.user?.permissions?.includes(permission);
}
