import { db } from "@/lib/db";
import { SUPER_ADMIN_ROLE_KEY } from "@/lib/rbac/permissions";

// Every query here takes `includeSuperAdmin` (true only for a Super Admin
// viewer) so the Super Admin account and role are structurally excluded from
// what non-Super-Admins can ever fetch, not just hidden in the UI.

export function getUsers(includeSuperAdmin: boolean) {
  return db.user.findMany({
    where: includeSuperAdmin ? {} : { role: { key: { not: SUPER_ADMIN_ROLE_KEY } } },
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string, includeSuperAdmin: boolean) {
  const user = await db.user.findUnique({ where: { id }, include: { role: true } });
  if (!user) return null;
  if (user.role.key === SUPER_ADMIN_ROLE_KEY && !includeSuperAdmin) return null;
  return user;
}

export function getRoles(includeSuperAdmin: boolean) {
  return db.role.findMany({
    where: includeSuperAdmin ? {} : { key: { not: SUPER_ADMIN_ROLE_KEY } },
    orderBy: { name: "asc" },
  });
}
