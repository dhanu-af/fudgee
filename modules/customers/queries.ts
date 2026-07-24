import { db } from "@/lib/db";

export function getCustomers() {
  return db.customer.findMany({ orderBy: { createdAt: "desc" } });
}

export function getCustomerById(id: string) {
  return db.customer.findUnique({ where: { id } });
}

export function getPromoCodesByCustomerId(customerId: string) {
  return db.promoCode.findMany({ where: { customerId }, orderBy: { createdAt: "desc" } });
}

// All of a customer's promo codes that are actually usable right now — same
// isActive/not-expired rule as getValidPromoCode() below, just not scoped to
// one specific code. Used by the customer's own account page.
export function getCustomerActivePromoCodes(customerId: string) {
  const now = new Date();
  return db.promoCode.findMany({
    where: {
      customerId,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: { discountPercent: "desc" },
  });
}

// The single source of truth for whether a code is redeemable by a given
// customer — used both by the cart page's live "Apply" preview and by
// checkout-actions.ts's server-side re-validation, so the two can never
// disagree about whether a code is valid. Deliberately scoped to
// customerId: a promo code only works for the specific customer it was
// issued to, not anyone who happens to see/guess the string.
export async function getValidPromoCode(code: string, customerId: string) {
  const now = new Date();
  const promo = await db.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!promo || promo.customerId !== customerId || !promo.isActive) return null;
  if (promo.expiresAt && promo.expiresAt < now) return null;
  return promo;
}
