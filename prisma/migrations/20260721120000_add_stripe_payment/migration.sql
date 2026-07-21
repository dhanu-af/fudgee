-- CreateEnum
CREATE TYPE "SalesOrderPaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "gstAmount" DECIMAL(14,4),
ADD COLUMN     "paymentStatus" "SalesOrderPaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_stripeCheckoutSessionId_key" ON "SalesOrder"("stripeCheckoutSessionId");
