import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac/can";
import type { PermissionKey } from "@/lib/rbac/permissions";

// Called as the first line of every dashboard page and every server action —
// this is the real enforcement layer. Nav-hiding via the module registry is UX only.
export async function requirePermission(permission: PermissionKey) {
  const session = await auth();
  console.log("[requirePermission]", { permission, hasSession: !!session, user: session?.user?.email, roleKey: session?.user?.roleKey });
  if (!session) redirect("/login");
  if (!can(session, permission)) redirect("/unauthorized");
  return session;
}
