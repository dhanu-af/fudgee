-- AlterTable: add nullable first so existing rows can be backfilled
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Backfill existing users with a username derived from their prior identity
UPDATE "User" SET "username" = 'Dhanu' WHERE "email" = 'dhanu@healthicons.com';
UPDATE "User" SET "username" = 'super_admin' WHERE "email" = 'super_admin@fudgee.test';
UPDATE "User" SET "username" = 'admin' WHERE "email" = 'admin@fudgee.test';
UPDATE "User" SET "username" = 'production' WHERE "email" = 'production@fudgee.test';
UPDATE "User" SET "username" = 'warehouse' WHERE "email" = 'warehouse@fudgee.test';
UPDATE "User" SET "username" = 'sales' WHERE "email" = 'sales@fudgee.test';
UPDATE "User" SET "username" = 'finance' WHERE "email" = 'finance@fudgee.test';
UPDATE "User" SET "username" = 'management' WHERE "email" = 'management@fudgee.test';

-- Now enforce NOT NULL + uniqueness
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
