-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "discountPercent" INTEGER;

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "discountAmount" DECIMAL(14,4);
