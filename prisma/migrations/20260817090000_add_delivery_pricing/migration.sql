-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "minKm" DECIMAL(6,2) NOT NULL,
    "maxKm" DECIMAL(6,2),
    "fee" DECIMAL(10,2) NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryFreeRule" (
    "id" TEXT NOT NULL,
    "minOrderValue" DECIMAL(10,2) NOT NULL,
    "maxKm" DECIMAL(6,2) NOT NULL,
    "label" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryFreeRule_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "StorefrontSettings" ADD COLUMN     "originAddress" TEXT,
ADD COLUMN     "originLat" DECIMAL(9,6),
ADD COLUMN     "originLng" DECIMAL(9,6);

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "deliveryFee" DECIMAL(14,4),
ADD COLUMN     "deliveryFeeReason" TEXT;

-- Seed: Dhanu's own delivery-zone table (0-10km $5, 10-20km $7, 20-40km $15,
-- >40km no delivery) and free-delivery rule (orders >= $100, within 40km).
-- All editable afterwards from /storefront/delivery — this is a starting
-- point, not a hardcoded rule.
INSERT INTO "DeliveryZone" ("id", "minKm", "maxKm", "fee", "label", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 0.00, 10.00, 5.00, 'Zone 1 (0–10 km)', true, 0, now(), now()),
  (gen_random_uuid()::text, 10.00, 20.00, 7.00, 'Zone 2 (10–20 km)', true, 1, now(), now()),
  (gen_random_uuid()::text, 20.00, 40.00, 15.00, 'Zone 3 (20–40 km)', true, 2, now(), now());

INSERT INTO "DeliveryFreeRule" ("id", "minOrderValue", "maxKm", "label", "priority", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 100.00, 40.00, 'Free delivery – orders over $100 within 40 km.', 0, true, now(), now());
