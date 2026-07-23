-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "rewardsPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RewardsLedgerEntry" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "salesOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardsLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardsLedgerEntry_salesOrderId_key" ON "RewardsLedgerEntry"("salesOrderId");

-- AddForeignKey
ALTER TABLE "RewardsLedgerEntry" ADD CONSTRAINT "RewardsLedgerEntry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
