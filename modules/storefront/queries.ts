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
  return db.review.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export function getReviewById(id: string) {
  return db.review.findUnique({ where: { id } });
}

export function getFaqItems() {
  return db.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export function getFaqItemById(id: string) {
  return db.faqItem.findUnique({ where: { id } });
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

// --- Public homepage read (unauthenticated) ---
// A single aggregate query for the whole page — every list is scoped to
// isActive/in-stock so draft/inactive admin content never reaches the
// public site.

export async function getStorefrontHomepageData() {
  const [settings, categories, featuredProducts, bestSellerProducts, galleryItems, reviews, faqItems] =
    await Promise.all([
      db.storefrontSettings.findFirst(),
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
        where: { isActive: true, isFeatured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      db.faqItem.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);

  return { settings, categories, featuredProducts, bestSellerProducts, galleryItems, reviews, faqItems };
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
