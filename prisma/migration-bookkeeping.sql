-- Prisma migration bookkeeping (run this FIRST, before the migration.sql content)
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
VALUES ('2e798e50-be8d-421b-87ab-58747c3d5a91', 'fe08abb12c6a273283989ffb1f183b99385e45f4990869228b70d013d3abe6b5', now(), '20260717230146_init', now(), 1);
