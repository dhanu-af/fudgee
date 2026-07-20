import { z } from "zod";

// Transforms a blank submission to `null` (not `undefined`) — Prisma treats
// `undefined` as "leave this field alone" on update, so an actually-cleared
// field has to be sent as an explicit null or the old value would stick.
const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? null : v));

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(slugPattern, "Slug can only contain lowercase letters, numbers, and hyphens"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const galleryItemSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required").max(2000),
  caption: optionalText(300),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

export const reviewSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(200),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(1, "Review text is required").max(2000),
  isFeatured: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
  // Blank = a general site-wide testimonial; set = a review of that
  // specific product, shown on its product detail page instead.
  productId: optionalText(64),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required").max(300),
  answer: z.string().min(1, "Answer is required").max(3000),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type FaqItemInput = z.infer<typeof faqItemSchema>;

export const storefrontSettingsSchema = z.object({
  heroHeading: optionalText(200),
  heroSubheading: optionalText(500),
  heroImageUrl: optionalText(2000),
  aboutHeading: optionalText(200),
  aboutBody: optionalText(3000),
  aboutImageUrl: optionalText(2000),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? null : v)),
  contactPhone: optionalText(50),
  contactAddress: optionalText(500),
  openingHours: optionalText(500),
  whatsappNumber: optionalText(50),
  instagramUrl: optionalText(300),
  facebookUrl: optionalText(300),
  tiktokUrl: optionalText(300),
  newsletterHeading: optionalText(200),
  newsletterSubheading: optionalText(500),
});
export type StorefrontSettingsInput = z.infer<typeof storefrontSettingsSchema>;

// --- Public, unauthenticated forms (checkout, contact, newsletter) ---
// Server-side validation here is the only real gate (there's no login wall
// for shoppers by design), so these stay stricter than the admin schemas
// above: hard length caps and a sane per-line quantity ceiling.

export const checkoutLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(500),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required").max(200),
  phone: z.string().max(50).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  shippingAddress: z.string().min(1, "Delivery address is required").max(500),
  notes: z.string().max(1000).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  linesJson: z.string().min(1),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required").max(200),
  phone: z.string().max(50).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  message: z.string().min(1, "Message is required").max(2000),
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const newsletterSignupSchema = z.object({
  email: z.string().email("Valid email is required").max(200),
});
export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;

export const productReviewSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1, "Name is required").max(200),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(1, "Review text is required").max(2000),
});
export type ProductReviewInput = z.infer<typeof productReviewSchema>;

// Marketing fields grafted onto the existing Product create/edit forms.
export const productMarketingSchema = z.object({
  categoryId: optionalText(64),
  imageUrl: optionalText(2000),
  shortDescription: optionalText(500),
  isFeatured: z.coerce.boolean(),
  isBestSeller: z.coerce.boolean(),
  ingredients: optionalText(2000),
  allergens: optionalText(1000),
  nutritionInfo: optionalText(2000),
  storageInstructions: optionalText(1000),
  weight: optionalText(100),
  shelfLife: optionalText(100),
  deliveryInfo: optionalText(1000),
});
export type ProductMarketingInput = z.infer<typeof productMarketingSchema>;

export const productImageSchema = z.object({
  productId: z.string().min(1),
  imageUrl: z.string().min(1, "Image URL is required").max(2000),
});
export type ProductImageInput = z.infer<typeof productImageSchema>;
