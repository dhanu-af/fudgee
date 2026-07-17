const fs = require("fs");
const crypto = require("crypto");

const sql = fs.readFileSync("prisma/migrations/20260717230146_init/migration.sql", "utf-8");
const checksum = crypto.createHash("sha256").update(sql).digest("hex");
const id = crypto.randomUUID();

console.error("checksum length:", checksum.length);
console.error("id length:", id.length);

const out = `-- Prisma migration bookkeeping (run this FIRST, before the migration.sql content)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Run this LAST, after the migration.sql DDL has been executed
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
VALUES ('${id}', '${checksum}', now(), '20260717230146_init', now(), 1);
`;

fs.writeFileSync("prisma/migration-bookkeeping.sql", out);
console.error("wrote prisma/migration-bookkeeping.sql");
