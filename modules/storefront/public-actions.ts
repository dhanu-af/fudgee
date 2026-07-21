"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactMessageSchema, newsletterSignupSchema, productReviewSchema } from "@/modules/storefront/schema";

// Every action in this file is called by an unauthenticated site visitor —
// there is no permission check to fall back on, so input is validated
// strictly and nothing here ever trusts client-submitted prices or product
// data beyond an id to look up.
//
// Checkout itself lives in checkout-actions.ts (createStripeCheckout), which
// re-prices the same way but creates a Stripe Checkout Session instead of an
// unpaid order request.

export type ContactFormState = { error?: string; success?: boolean };

export async function submitContactMessage(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }

  await db.contactMessage.create({ data: parsed.data });
  revalidatePath("/storefront/messages");

  return { success: true };
}

export type ProductReviewFormState = { error?: string; success?: boolean };

export async function submitProductReview(
  _prev: ProductReviewFormState,
  formData: FormData
): Promise<ProductReviewFormState> {
  const parsed = productReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your review and try again." };
  }

  const product = await db.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return { error: "This product could not be found." };

  // Held for moderation — an admin approves it from Storefront > Reviews
  // (the same isActive toggle used for site-wide testimonials) before it
  // appears on the product page.
  await db.review.create({
    data: {
      customerName: parsed.data.customerName,
      rating: parsed.data.rating,
      body: parsed.data.body,
      productId: parsed.data.productId,
      isActive: false,
      isFeatured: false,
    },
  });

  revalidatePath("/storefront/reviews");

  return { success: true };
}

export type NewsletterFormState = { error?: string; success?: boolean };

export async function submitNewsletterSignup(
  _prev: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const parsed = newsletterSignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a valid email." };
  }

  try {
    await db.newsletterSignup.create({ data: parsed.data });
  } catch {
    return { success: true }; // already subscribed — treat as success, no need to reveal that
  }
  revalidatePath("/storefront/newsletter");

  return { success: true };
}
