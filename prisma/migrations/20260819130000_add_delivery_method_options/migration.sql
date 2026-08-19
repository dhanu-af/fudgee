-- CreateEnum
CREATE TYPE "SalesOrderDeliveryMethod" AS ENUM ('FUDGEE', 'CUSTOMER_ARRANGED', 'UBER', 'COURIER', 'OTHER');

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "deliveryMethod" "SalesOrderDeliveryMethod" NOT NULL DEFAULT 'OTHER';

-- Backfill: every existing storefront-checkout order (identified by a real
-- payment method or the over-delivery-range flag — admin-created orders
-- have neither) went through Fudgee's own delivery, since that was the
-- only option before this column existed.
UPDATE "SalesOrder" SET "deliveryMethod" = 'FUDGEE' WHERE "paymentMethod" != 'OTHER' OR "outOfDeliveryRange" = true;
