-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "badge" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- Seed the first announcement (500 orders milestone, reported 2026-08-24)
INSERT INTO "NewsItem" (id, title, description, badge, "linkUrl", "linkLabel", "publishedAt", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  'ca25d41b-eb74-4623-9363-a7eb4546862f',
  '500 Orders Delivered',
  'We''ve now handcrafted and shipped over 500 orders of fudge and confections to customers across Australia. Thank you for supporting small-batch, real-cream, real-butter fudge — here''s to the next 500.',
  'Milestone',
  '/shop',
  'Shop Now',
  '2026-08-17 00:00:00',
  0,
  true,
  now(),
  now()
);
