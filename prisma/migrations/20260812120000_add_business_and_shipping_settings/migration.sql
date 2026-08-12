-- AlterTable
ALTER TABLE "StorefrontSettings" ADD COLUMN     "legalBusinessName" TEXT,
ADD COLUMN     "abn" TEXT,
ADD COLUMN     "deliveryAreas" TEXT,
ADD COLUMN     "deliveryFee" TEXT,
ADD COLUMN     "freeDeliveryThreshold" TEXT,
ADD COLUMN     "dispatchTime" TEXT,
ADD COLUMN     "estimatedDeliveryTime" TEXT,
ADD COLUMN     "courierName" TEXT;
