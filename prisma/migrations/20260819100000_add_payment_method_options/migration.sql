-- CreateEnum
CREATE TYPE "SalesOrderPaymentMethod" AS ENUM ('STRIPE', 'CASH', 'PAYID', 'OTHER');

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "paymentMethod" "SalesOrderPaymentMethod" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "paymentPhone" TEXT;

-- AlterTable
ALTER TABLE "StorefrontSettings" ADD COLUMN     "payIdDetails" TEXT,
ADD COLUMN     "cashInstructions" TEXT;

-- Backfill: every existing order that actually has a Stripe checkout
-- session really was paid by card through Stripe — this is the only
-- accurate signal available for orders placed before this column existed
-- (admin-created orders never had a Stripe session, so they correctly stay
-- at the OTHER default set above).
UPDATE "SalesOrder" SET "paymentMethod" = 'STRIPE' WHERE "stripeCheckoutSessionId" IS NOT NULL;
