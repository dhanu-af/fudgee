-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allergens" TEXT,
ADD COLUMN     "deliveryInfo" TEXT,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "nutritionInfo" TEXT,
ADD COLUMN     "shelfLife" TEXT,
ADD COLUMN     "storageInstructions" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
