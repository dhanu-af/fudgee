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

// A URL-specific variant of optionalText: extracts a bare http(s) link out of
// pasted text (e.g. WhatsApp's own "share" text prepends a label before the
// link) and fixes a stray single slash after the scheme, then validates
// what's left is an actual URL. Without this, a share-text paste like
// "Open this link to join my WhatsApp Group: https:/chat.whatsapp.com/xyz"
// would silently save verbatim and quietly break the button it powers.
const optionalUrl = (max: number) =>
  z
    .string()
    .max(max + 300)
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (v === "" || v === undefined) return null;
      const stripped = v.replace(/[\u200B-\u200F\u2028-\u202F]/g, "").trim();
      const match = stripped.match(/https?:\/*\S+/i);
      if (!match) return stripped;
      return match[0].replace(/^(https?):\/(?!\/)/i, "$1://");
    })
    .pipe(z.string().max(max).url("Must be a valid link, e.g. https://chat.whatsapp.com/...").nullable());

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
  videoUrl: optionalText(2000),
  caption: optionalText(300),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

export const heroImageSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required").max(2000),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type HeroImageInput = z.infer<typeof heroImageSchema>;

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

const optionalDate = () =>
  z.preprocess(
    (val) => (val === "" || val == null ? undefined : val),
    z.coerce.date().optional()
  );

// Blank clears an existing discount (explicit null, same convention as
// optionalText) — a whole-order percentage auto-applied at checkout while
// this promotion is active, see getBestActiveDiscount() in queries.ts.
const optionalPercent = () =>
  z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : val),
      z.coerce.number().int().min(1, "Discount % must be between 1 and 100").max(100, "Discount % must be between 1 and 100").optional()
    )
    .transform((v) => v ?? null);

// Blank clears an existing minimum (same convention as optionalPercent) — the
// discount above only auto-applies once the cart subtotal reaches this
// amount; leave blank to apply at any order size.
const optionalMoney = () =>
  z
    .preprocess(
      (val) => (val === "" || val == null ? undefined : val),
      z.coerce.number().positive("Minimum order amount must be greater than 0").optional()
    )
    .transform((v) => v ?? null);

export const promotionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: optionalText(1000),
  imageUrl: optionalText(2000),
  linkUrl: optionalText(500),
  linkLabel: optionalText(50),
  discountPercent: optionalPercent(),
  minimumSpend: optionalMoney(),
  startDate: optionalDate(),
  endDate: optionalDate(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type PromotionInput = z.infer<typeof promotionSchema>;

export const storefrontSettingsSchema = z.object({
  heroHeading: optionalText(200),
  heroSubheading: optionalText(500),
  heroImageUrl: optionalText(2000),
  heroVideoUrl: optionalText(2000),
  aboutHeading: optionalText(200),
  aboutBody: optionalText(3000),
  aboutImageUrl: optionalText(2000),
  aboutVideoUrl: optionalText(2000),
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
  whatsappCommunityUrl: optionalUrl(300),
  instagramUrl: optionalUrl(300),
  facebookUrl: optionalUrl(300),
  facebookFanPageUrl: optionalUrl(300),
  tiktokUrl: optionalUrl(300),
  googleReviewUrl: optionalUrl(300),
  newsletterHeading: optionalText(200),
  newsletterSubheading: optionalText(500),
  legalBusinessName: optionalText(200),
  abn: optionalText(20),
  deliveryAreas: optionalText(500),
  deliveryFee: optionalText(200),
  freeDeliveryThreshold: optionalText(200),
  dispatchTime: optionalText(200),
  estimatedDeliveryTime: optionalText(200),
  courierName: optionalText(200),
  originAddress: optionalText(500),
  payIdDetails: optionalText(300),
  cashInstructions: optionalText(300),
});
export type StorefrontSettingsInput = z.infer<typeof storefrontSettingsSchema>;

// --- Delivery pricing (admin-managed — see /storefront/delivery) ---

export const deliveryZoneSchema = z
  .object({
    minKm: z.coerce.number().min(0, "Must be 0 or greater"),
    maxKm: z
      .preprocess(
        (v) => (v === "" || v == null ? undefined : v),
        z.coerce.number().positive("Must be greater than 0").optional()
      )
      .transform((v) => v ?? null),
    fee: z.coerce.number().min(0, "Fee must be 0 or greater"),
    label: optionalText(100),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.coerce.boolean(),
  })
  .refine((data) => data.maxKm == null || data.maxKm > data.minKm, {
    message: "Max distance must be greater than min distance (or left blank for no upper limit)",
    path: ["maxKm"],
  });
export type DeliveryZoneInput = z.infer<typeof deliveryZoneSchema>;

export const deliveryFreeRuleSchema = z.object({
  minOrderValue: z.coerce.number().min(0, "Must be 0 or greater"),
  maxKm: z.coerce.number().positive("Must be greater than 0"),
  label: z.string().min(1, "Label is required").max(300),
  priority: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean(),
});
export type DeliveryFreeRuleInput = z.infer<typeof deliveryFreeRuleSchema>;

export const deliverySuburbOverrideSchema = z
  .object({
    suburb: optionalText(200),
    postcode: optionalText(10),
    zoneId: z.string().min(1, "Choose a zone"),
    isActive: z.coerce.boolean(),
  })
  .refine((data) => data.suburb != null || data.postcode != null, {
    message: "Enter a suburb, a postcode, or both",
    path: ["suburb"],
  });
export type DeliverySuburbOverrideInput = z.infer<typeof deliverySuburbOverrideSchema>;

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
  // The suburb/postcode the customer typed into the checkout's own separate
  // boxes — sent alongside shippingAddress (not parsed back out of it) so
  // quoteDelivery() can check DeliverySuburbOverride without needing
  // geocoding to succeed first. Optional since older/direct API callers
  // might not send them; a missing value just means overrides can't match.
  deliverySuburb: z.string().max(200).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  deliveryPostcode: z.string().max(10).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  notes: z.string().max(1000).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  linesJson: z.string().min(1),
  promoCode: z.string().max(30).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  // "card" pays immediately through Stripe (the only path that existed
  // before); "payid" creates the order UNPAID and skips Stripe entirely —
  // Dhanu arranges/confirms payment with the customer directly. Cash was
  // removed as an option — not permitted for this business under
  // Australian cash-handling rules.
  paymentMethod: z.enum(["card", "payid"]).default("card"),
  // Required only for payid (checked below) — the number Dhanu contacts
  // to arrange payment, which may differ from `phone` above.
  paymentPhone: z.string().max(50).optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  // Set only by the "Send order request" button shown when the address is
  // beyond the delivery radius — skips the payment-method requirement
  // below entirely, since payment can't be arranged until Dhanu manually
  // confirms delivery is even possible (see submitCheckout).
  outOfRangeRequest: z.coerce.boolean().optional(),
  // "fudgee" runs the automatic distance/zone pricing exactly as before;
  // the other three mean the customer is getting it from Fudgee to
  // themselves their own way — no distance calculation runs, no delivery
  // fee is ever charged (see submitCheckout).
  deliveryMethod: z.enum(["fudgee", "customer_arranged", "uber", "courier"]).default("fudgee"),
}).refine((data) => data.outOfRangeRequest || data.paymentMethod === "card" || !!data.paymentPhone, {
  message: "A mobile number is required for Cash or PayID payment.",
  path: ["paymentPhone"],
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
