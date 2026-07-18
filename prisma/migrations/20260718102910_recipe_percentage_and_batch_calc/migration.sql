-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "baseBatchSize" DECIMAL(14,4);

-- AlterTable
ALTER TABLE "RecipeLine" DROP COLUMN "quantityPerUnit",
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "changeControlRef" TEXT,
ADD COLUMN     "controlStatus" TEXT NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "percentage" DECIMAL(9,4),
ADD COLUMN     "uin" TEXT;

-- CreateTable
CREATE TABLE "BatchCalculation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "batchNumber" TEXT,
    "requiredBatchSize" DECIMAL(14,4) NOT NULL,
    "tolerancePercent" DECIMAL(5,2) NOT NULL DEFAULT 2,
    "enteredBy" TEXT,
    "checkedBy" TEXT,
    "calculationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchCalculationLine" (
    "id" TEXT NOT NULL,
    "batchCalculationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "percentage" DECIMAL(9,4) NOT NULL,
    "calculatedQty" DECIMAL(14,4) NOT NULL,
    "roundedQty" DECIMAL(14,4) NOT NULL,
    "minQty" DECIMAL(14,4) NOT NULL,
    "maxQty" DECIMAL(14,4) NOT NULL,
    "actualDispensed" DECIMAL(14,4),

    CONSTRAINT "BatchCalculationLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BatchCalculation" ADD CONSTRAINT "BatchCalculation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchCalculationLine" ADD CONSTRAINT "BatchCalculationLine_batchCalculationId_fkey" FOREIGN KEY ("batchCalculationId") REFERENCES "BatchCalculation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchCalculationLine" ADD CONSTRAINT "BatchCalculationLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

