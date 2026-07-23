import { db } from "@/lib/db";

// --- Admin CRUD reads ---

export function getCategories() {
  return db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export function getCategoryById(id: string) {
  return db.category.findUnique({ where: { id } });
}

export function getGalleryItems() {
  return db.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export function getGalleryItemById(id: string) {
  return db.galleryItem.findUnique({ where: { id } });
}

export function getReviews() {
  return db.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export function getReviewById(id: string) {
  return db.review.findUnique({ where: { id } });
}

// For the "which product is this review for?" picker on the admin Reviews
// form — a plain list, not the fuller getShopProducts (no need to filter to
// active/finished-good here since an admin should be able to link a review
// to any product).
export function getProductsForReviewPicker() {
  return db.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export function getFaqItems() {
  return db.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export function getFaqItemById(id: string) {
  return db.faqItem.findUnique({ where: { id } });
}

export function getPromotions() {
  return db.promotion.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export function getPromotionById(id: string) {
  return db.promotion.findUnique({ where: { id } });
}

export function getStorefrontSettings() {
  return db.storefrontSettings.findFirst();
}

export function getContactMessages() {
  return db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export function getNewsletterSignups() {
  return db.newsletterSignup.findMany({ orderBy: { createdAt: "desc" } });
}

// Active AND (not yet started, or already started) AND (no end, or not yet
// ended) — lets a promo be scheduled ahead of time, or just toggled by hand
// for a same-day one. Shared by the homepage and the customer account page.
export function getActivePromotions() {
  const now = new Date();
  return db.promotion.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

// --- Public homepage read (unauthenticated) ---
// A single aggregate query for the whole page — every list is scoped to
// isActive/in-stock so draft/inactive admin content never reaches the
// public site.

export async function getStorefrontHomepageData() {
  const [settings, promotions, categories, featuredProducts, bestSellerProducts, galleryItems, reviews, faqItems] =
    await Promise.all([
      db.storefrontSettings.findFirst(),
      getActivePromotions(),
      db.category.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          products: {
            where: { status: "ACTIVE", type: "FINISHED_GOOD" },
            orderBy: { name: "asc" },
          },
        },
      }),
      db.product.findMany({
        where: { isFeatured: true, status: "ACTIVE", type: "FINISHED_GOOD" },
        orderBy: { name: "asc" },
        include: { category: true },
      }),
      db.product.findMany({
        where: { isBestSeller: true, status: "ACTIVE", type: "FINISHED_GOOD" },
        orderBy: { name: "asc" },
        include: { category: true },
      }),
      db.galleryItem.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      db.review.findMany({
        // Product-linked reviews live on their own product page instead —
        // keeps the homepage testimonials to general, site-wide reviews.
        where: { isActive: true, isFeatured: true, productId: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      db.faqItem.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);

  return { settings, promotions, categories, featuredProducts, bestSellerProducts, galleryItems, reviews, faqItems };
}

// Every purchasable product (for the shop/cart), grouped implicitly by
// category via the categoryId already on each row.
export function getShopProducts() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: "FINISHED_GOOD" },
    orderBy: { name: "asc" },
    include: { category: true },
  });
}

// Public product detail page: the product plus its gallery photos and
// approved (isActive) reviews, with a 1-5 star count breakdown for the
// rating summary bar chart.
export async function getPublicProductDetail(id: string) {
  const product = await db.product.findFirst({
    where: { id, status: "ACTIVE", type: "FINISHED_GOOD" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: product.reviews.filter((r) => r.rating === stars).length,
  }));
  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;

  return { product, breakdown, reviewCount, averageRating };
}
