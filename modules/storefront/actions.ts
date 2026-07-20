"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  categorySchema,
  galleryItemSchema,
  reviewSchema,
  faqItemSchema,
  storefrontSettingsSchema,
} from "@/modules/storefront/schema";

export type StorefrontFormState = { error?: string; success?: boolean };

// --- Categories ---

export async function createCategory(_prev: StorefrontFormState, formData: FormData): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await db.category.create({ data: parsed.data });
  } catch {
    return { error: "A category with that slug already exists." };
  }

  revalidatePath("/storefront/categories");
  redirect("/storefront/categories");
}

export async function updateCategory(
  id: string,
  _prev: StorefrontFormState,
  formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await db.category.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A category with that slug already exists." };
  }

  revalidatePath("/storefront/categories");
  redirect("/storefront/categories");
}

export async function deleteCategory(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);

  try {
    await db.category.delete({ where: { id } });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2003") {
      return { error: "Can't delete — products are still assigned to this category." };
    }
    return { error: "Failed to delete category." };
  }

  revalidatePath("/storefront/categories");
  redirect("/storefront/categories");
}

// --- Gallery ---

export async function createGalleryItem(_prev: StorefrontFormState, formData: FormData): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = galleryItemSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.galleryItem.create({ data: parsed.data });

  revalidatePath("/storefront/gallery");
  redirect("/storefront/gallery");
}

export async function updateGalleryItem(
  id: string,
  _prev: StorefrontFormState,
  formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = galleryItemSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.galleryItem.update({ where: { id }, data: parsed.data });

  revalidatePath("/storefront/gallery");
  redirect("/storefront/gallery");
}

export async function deleteGalleryItem(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);

  await db.galleryItem.delete({ where: { id } }).catch(() => null);

  revalidatePath("/storefront/gallery");
  redirect("/storefront/gallery");
}

// --- Reviews ---

export async function createReview(_prev: StorefrontFormState, formData: FormData): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = reviewSchema.safeParse({
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    body: formData.get("body"),
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    productId: formData.get("productId"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.review.create({ data: parsed.data });

  revalidatePath("/storefront/reviews");
  if (parsed.data.productId) revalidatePath(`/shop/${parsed.data.productId}`);
  redirect("/storefront/reviews");
}

export async function updateReview(
  id: string,
  _prev: StorefrontFormState,
  formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = reviewSchema.safeParse({
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    body: formData.get("body"),
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    productId: formData.get("productId"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.review.update({ where: { id }, data: parsed.data });

  revalidatePath("/storefront/reviews");
  if (parsed.data.productId) revalidatePath(`/shop/${parsed.data.productId}`);
  redirect("/storefront/reviews");
}

export async function deleteReview(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);

  await db.review.delete({ where: { id } }).catch(() => null);

  revalidatePath("/storefront/reviews");
  redirect("/storefront/reviews");
}

// --- FAQ ---

export async function createFaqItem(_prev: StorefrontFormState, formData: FormData): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = faqItemSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.faqItem.create({ data: parsed.data });

  revalidatePath("/storefront/faq");
  redirect("/storefront/faq");
}

export async function updateFaqItem(
  id: string,
  _prev: StorefrontFormState,
  formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = faqItemSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.faqItem.update({ where: { id }, data: parsed.data });

  revalidatePath("/storefront/faq");
  redirect("/storefront/faq");
}

export async function deleteFaqItem(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);

  await db.faqItem.delete({ where: { id } }).catch(() => null);

  revalidatePath("/storefront/faq");
  redirect("/storefront/faq");
}

// --- Storefront settings (singleton — self-initializes on first save) ---

export async function updateStorefrontSettings(
  _prev: StorefrontFormState,
  formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);

  const parsed = storefrontSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const existing = await db.storefrontSettings.findFirst();
  if (existing) {
    await db.storefrontSettings.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await db.storefrontSettings.create({ data: parsed.data });
  }

  revalidatePath("/storefront/settings");
  revalidatePath("/");
  return { success: true };
}

// --- Contact messages / newsletter signups (inbound-only, no edit form) ---

export async function markContactMessageRead(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  await db.contactMessage.update({ where: { id }, data: { isRead: true } }).catch(() => null);
  revalidatePath("/storefront/messages");
  return { success: true };
}

export async function deleteContactMessage(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);
  await db.contactMessage.delete({ where: { id } }).catch(() => null);
  revalidatePath("/storefront/messages");
  redirect("/storefront/messages");
}

export async function deleteNewsletterSignup(
  id: string,
  _prev: StorefrontFormState,
  _formData: FormData
): Promise<StorefrontFormState> {
  await requirePermission(PERMISSIONS.STOREFRONT_DELETE);
  await db.newsletterSignup.delete({ where: { id } }).catch(() => null);
  revalidatePath("/storefront/newsletter");
  redirect("/storefront/newsletter");
}
