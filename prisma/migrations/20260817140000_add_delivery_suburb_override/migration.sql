-- CreateTable
CREATE TABLE "DeliverySuburbOverride" (
    "id" TEXT NOT NULL,
    "suburb" TEXT,
    "postcode" TEXT,
    "zoneId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverySuburbOverride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeliverySuburbOverride" ADD CONSTRAINT "DeliverySuburbOverride_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
