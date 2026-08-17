import { db } from "@/lib/db";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { geocodeAddress, haversineKm } from "@/lib/storefront/geocode";

export type DeliveryQuote =
  | { status: "free"; fee: 0; reason: string; distanceKm: number | null }
  | { status: "charged"; fee: number; distanceKm: number | null; zoneLabel: string | null }
  // Distance is beyond every configured DeliveryZone/DeliveryFreeRule's
  // maxKm — a deliberate "we don't deliver there at all" business rule
  // (e.g. Dhanu's 40km cutoff), not a technical hiccup. Checkout should
  // block on this one.
  | { status: "out_of_range"; distanceKm: number; maxKm: number }
  // Origin not configured yet, or the address couldn't be geocoded (even
  // after every fallback candidate) with no suburb/postcode override to
  // rescue it, or no zone/rule covers this distance because none are
  // configured at all. Checkout should NOT block on this — let the order
  // through with a $0 delivery fee and flag it for staff to confirm
  // manually.
  | { status: "unknown"; reason: string; distanceKm: number | null };

// A known suburb/postcode always wins over the geocoded distance — no
// geocoding attempted at all when one matches, per Dhanu's "assign this
// suburb straight to a zone regardless of calculated distance" request.
// Case-insensitive on suburb; exact (trimmed) match on postcode. A row
// only needs whichever of the two fields it set to match.
async function findSuburbOverride(suburb: string | undefined, postcode: string | undefined) {
  const normSuburb = suburb?.trim().toLowerCase();
  const normPostcode = postcode?.trim();
  if (!normSuburb && !normPostcode) return null;

  const overrides = await db.deliverySuburbOverride.findMany({
    where: { isActive: true },
    include: { zone: true },
  });
  return (
    overrides.find(
      (o) =>
        (normSuburb && o.suburb && o.suburb.trim().toLowerCase() === normSuburb) ||
        (normPostcode && o.postcode && o.postcode.trim() === normPostcode)
    ) ?? null
  );
}

// Central pricing engine — both the live checkout preview (see
// getDeliveryQuoteAction in checkout-actions.ts) and the authoritative
// server-side charge (createStripeCheckout, same file) call this exact
// function, so the two can never disagree about what a customer is charged.
// suburb/postcode are optional — pass them whenever the caller has them
// (the checkout form's own separate boxes) so a DeliverySuburbOverride can
// short-circuit geocoding entirely.
export async function quoteDelivery(
  address: string,
  orderSubtotal: number,
  location?: { suburb?: string; postcode?: string }
): Promise<DeliveryQuote> {
  const settings = await getStorefrontSettings();
  if (settings?.originLat == null || settings?.originLng == null) {
    return {
      status: "unknown",
      reason: "We'll confirm your delivery fee directly — our delivery-pricing setup isn't finished yet.",
      distanceKm: null,
    };
  }

  const [freeRules, override] = await Promise.all([
    db.deliveryFreeRule.findMany({ where: { isActive: true }, orderBy: { priority: "asc" } }),
    findSuburbOverride(location?.suburb, location?.postcode),
  ]);

  if (override) {
    // No real distance to check a free rule's maxKm against — an override
    // exists specifically because this area IS deliverable, so a rule's
    // order-value condition alone decides free vs. charged here.
    const freeRule = freeRules.find((rule) => orderSubtotal >= Number(rule.minOrderValue));
    if (freeRule) return { status: "free", fee: 0, reason: freeRule.label, distanceKm: null };
    return { status: "charged", fee: Number(override.zone.fee), distanceKm: null, zoneLabel: override.zone.label };
  }

  const dest = await geocodeAddress(address);
  if (!dest) {
    return {
      status: "unknown",
      reason: "We couldn't pinpoint that address automatically — we'll confirm your delivery fee directly.",
      distanceKm: null,
    };
  }

  const distanceKm = haversineKm({ lat: Number(settings.originLat), lng: Number(settings.originLng) }, dest);

  const zones = await db.deliveryZone.findMany({ where: { isActive: true }, orderBy: { minKm: "asc" } });

  // The delivery radius is derived from config, not hardcoded — the
  // furthest maxKm across every active zone/free-rule. If any active zone
  // has no maxKm (unbounded), there's no radius cutoff at all. Beyond the
  // radius, delivery isn't offered regardless of order value (mirrors
  // Dhanu's ">40km -> no delivery" rule taking priority over the free
  // threshold in her own worked examples).
  const hasUnboundedZone = zones.some((z) => z.maxKm == null);
  const boundedMaxKms = [...zones.map((z) => z.maxKm), ...freeRules.map((r) => r.maxKm)]
    .filter((v): v is NonNullable<typeof v> => v != null)
    .map(Number);
  const deliveryRadiusKm = hasUnboundedZone || boundedMaxKms.length === 0 ? null : Math.max(...boundedMaxKms);

  if (deliveryRadiusKm != null && distanceKm > deliveryRadiusKm) {
    return { status: "out_of_range", distanceKm, maxKm: deliveryRadiusKm };
  }

  for (const rule of freeRules) {
    if (orderSubtotal >= Number(rule.minOrderValue) && distanceKm <= Number(rule.maxKm)) {
      return { status: "free", fee: 0, reason: rule.label, distanceKm };
    }
  }

  const zone = zones.find((z) => distanceKm >= Number(z.minKm) && (z.maxKm == null || distanceKm <= Number(z.maxKm)));
  if (!zone) {
    return {
      status: "unknown",
      reason: "We don't have a delivery rate set up for that distance yet — we'll confirm your delivery fee directly.",
      distanceKm,
    };
  }

  return { status: "charged", fee: Number(zone.fee), distanceKm, zoneLabel: zone.label };
}
