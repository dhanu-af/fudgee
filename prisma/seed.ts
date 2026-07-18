import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { PERMISSIONS, ROLE_DEFAULT_PERMISSIONS, ROLE_LABELS } from "../lib/rbac/permissions";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Password123!";

async function main() {
  await db.organization.upsert({
    where: { id: "org_fudgee" },
    update: {},
    create: { id: "org_fudgee", name: "Fudgee" },
  });

  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((key) =>
      db.permission.upsert({
        where: { key },
        update: {},
        create: { key, module: key.split(":")[0], action: key.split(":")[1] },
      })
    )
  );
  const permissionByKey = new Map(permissionRecords.map((p) => [p.key, p.id]));

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const [roleKey, permissionKeys] of Object.entries(ROLE_DEFAULT_PERMISSIONS)) {
    const role = await db.role.upsert({
      where: { key: roleKey },
      update: {},
      create: { key: roleKey, name: ROLE_LABELS[roleKey] ?? roleKey },
    });

    await db.rolePermission.deleteMany({ where: { roleId: role.id } });
    await db.rolePermission.createMany({
      data: permissionKeys.map((permKey) => ({
        roleId: role.id,
        permissionId: permissionByKey.get(permKey)!,
      })),
    });

    await db.user.upsert({
      where: { email: `${roleKey}@fudgee.test` },
      update: { roleId: role.id },
      create: {
        username: roleKey,
        email: `${roleKey}@fudgee.test`,
        name: ROLE_LABELS[roleKey] ?? roleKey,
        passwordHash,
        roleId: role.id,
      },
    });

    console.log(`Seeded role "${roleKey}" with ${permissionKeys.length} permissions + demo user`);
  }

  console.log(`\nDemo login password for all seeded users: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
