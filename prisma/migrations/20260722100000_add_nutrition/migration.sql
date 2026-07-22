-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "servingSizeGrams" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "NutritionProfile" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "energyKj" DECIMAL(10,2),
    "energyKcal" DECIMAL(10,2),
    "protein" DECIMAL(10,3),
    "totalFat" DECIMAL(10,3),
    "saturatedFat" DECIMAL(10,3),
    "transFat" DECIMAL(10,3),
    "carbohydrates" DECIMAL(10,3),
    "sugars" DECIMAL(10,3),
    "addedSugars" DECIMAL(10,3),
    "dietaryFibre" DECIMAL(10,3),
    "sodium" DECIMAL(10,3),
    "cholesterol" DECIMAL(10,3),
    "potassium" DECIMAL(10,3),
    "calcium" DECIMAL(10,3),
    "iron" DECIMAL(10,3),
    "otherNutrients" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchNutrition" (
    "id" TEXT NOT NULL,
    "productionBatchId" TEXT NOT NULL,
    "servingSizeGrams" DECIMAL(10,2),
    "energyKj" DECIMAL(10,2),
    "energyKcal" DECIMAL(10,2),
    "protein" DECIMAL(10,3),
    "totalFat" DECIMAL(10,3),
    "saturatedFat" DECIMAL(10,3),
    "transFat" DECIMAL(10,3),
    "carbohydrates" DECIMAL(10,3),
    "sugars" DECIMAL(10,3),
    "addedSugars" DECIMAL(10,3),
    "dietaryFibre" DECIMAL(10,3),
    "sodium" DECIMAL(10,3),
    "cholesterol" DECIMAL(10,3),
    "potassium" DECIMAL(10,3),
    "calcium" DECIMAL(10,3),
    "iron" DECIMAL(10,3),
    "otherNutrients" JSONB,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchNutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionAuditLog" (
    "id" TEXT NOT NULL,
    "batchNutritionId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "changedByUserId" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionProfile_productId_key" ON "NutritionProfile"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BatchNutrition_productionBatchId_key" ON "BatchNutrition"("productionBatchId");

-- AddForeignKey
ALTER TABLE "NutritionProfile" ADD CONSTRAINT "NutritionProfile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchNutrition" ADD CONSTRAINT "BatchNutrition_productionBatchId_fkey" FOREIGN KEY ("productionBatchId") REFERENCES "ProductionBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchNutrition" ADD CONSTRAINT "BatchNutrition_lockedByUserId_fkey" FOREIGN KEY ("lockedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionAuditLog" ADD CONSTRAINT "NutritionAuditLog_batchNutritionId_fkey" FOREIGN KEY ("batchNutritionId") REFERENCES "BatchNutrition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionAuditLog" ADD CONSTRAINT "NutritionAuditLog_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
