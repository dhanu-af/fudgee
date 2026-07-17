import bcrypt from "bcryptjs";
import { PERMISSIONS, ROLE_DEFAULT_PERMISSIONS, ROLE_LABELS } from "../lib/rbac/permissions";

function sqlStr(v: string) {
  return `'${v.replace(/'/g, "''")}'`;
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const lines: string[] = [];

  lines.push(`-- Fudgee seed data (generated offline, no DB connection used)`);
  lines.push(`-- Run this in the Neon SQL Editor AFTER applying the migration SQL.`);
  lines.push(``);

  lines.push(`INSERT INTO "Organization" (id, name, "createdAt", "updatedAt")`);
  lines.push(`VALUES ('org_fudgee', 'Fudgee', now(), now())`);
  lines.push(`ON CONFLICT (id) DO NOTHING;`);
  lines.push(``);

  for (const roleKey of Object.keys(ROLE_DEFAULT_PERMISSIONS)) {
    lines.push(
      `INSERT INTO "Role" (id, key, name, "createdAt", "updatedAt") VALUES ('role_${roleKey}', ${sqlStr(roleKey)}, ${sqlStr(ROLE_LABELS[roleKey] ?? roleKey)}, now(), now()) ON CONFLICT (key) DO NOTHING;`
    );
  }
  lines.push(``);

  for (const permKey of Object.values(PERMISSIONS)) {
    const [module, action] = permKey.split(":");
    const permId = `perm_${permKey.replace(":", "_")}`;
    lines.push(
      `INSERT INTO "Permission" (id, key, module, action) VALUES ('${permId}', ${sqlStr(permKey)}, ${sqlStr(module)}, ${sqlStr(action)}) ON CONFLICT (key) DO NOTHING;`
    );
  }
  lines.push(``);

  for (const [roleKey, permKeys] of Object.entries(ROLE_DEFAULT_PERMISSIONS)) {
    for (const permKey of permKeys) {
      const permId = `perm_${permKey.replace(":", "_")}`;
      lines.push(
        `INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_${roleKey}', '${permId}') ON CONFLICT DO NOTHING;`
      );
    }
  }
  lines.push(``);

  for (const roleKey of Object.keys(ROLE_DEFAULT_PERMISSIONS)) {
    const email = `${roleKey}@fudgee.test`;
    const name = ROLE_LABELS[roleKey] ?? roleKey;
    lines.push(
      `INSERT INTO "User" (id, name, email, "passwordHash", "isActive", "roleId", "createdAt", "updatedAt") VALUES ('user_${roleKey}', ${sqlStr(name)}, ${sqlStr(email)}, ${sqlStr(passwordHash)}, true, 'role_${roleKey}', now(), now()) ON CONFLICT (email) DO NOTHING;`
    );
  }

  console.log(lines.join("\n"));
}

main();
