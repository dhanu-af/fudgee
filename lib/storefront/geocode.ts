type LatLng = { lat: number; lng: number };

// Nominatim often can't resolve a unit/apartment-prefixed street (e.g.
// "Unit 2/86 Burnside Rd" or "2/86 Burnside Rd") since the unit number isn't
// a real geocodable feature — it just fails the whole lookup. Building a
// list of progressively simplified candidates (unit prefix stripped, then
// the street number too) and trying each in order fixes that without ever
// needing a paid geocoder: a real address almost always resolves once the
// street name + suburb/state/postcode is all that's left, at the cost of
// slightly coarser precision on the rare address that actually needed it.
function buildAddressCandidates(address: string): string[] {
  const trimmed = address.trim();
  if (!trimmed) return [];

  const candidates = [trimmed];

  // "Unit 2/86 ..." or "2/86 ..." -> "86 ..."
  const withoutUnit = trimmed.replace(/^(?:unit\s+)?\d+[a-z]?\/(?=\d)/i, "").trim();
  if (withoutUnit && withoutUnit !== trimmed) candidates.push(withoutUnit);

  // "86 Burnside Rd, ..." -> "Burnside Rd, ..."
  const base = withoutUnit || trimmed;
  const withoutStreetNumber = base.replace(/^\d+[a-z]?\s+/i, "").trim();
  if (withoutStreetNumber && withoutStreetNumber !== base) candidates.push(withoutStreetNumber);

  return [...new Set(candidates)];
}

async function geocodeOnce(address: string): Promise<LatLng | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "FudgeeStorefront/1.0 (fudgee.au@gmail.com)" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const results = (await res.json()) as { lat: string; lon: string }[];
    const first = results[0];
    if (!first) return null;

    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch (err) {
    console.error("Geocoding failed for address:", address, err);
    return null;
  }
}

// Nominatim (OpenStreetMap) — free, no API key, no Vercel env var for Dhanu
// to manage. Its usage policy requires an identifying User-Agent and caps
// requests to ~1/second; the handful of retries here for a single checkout
// address are nowhere near sustained load. Returns null (never throws) only
// once every fallback candidate has failed, so callers can fall back to
// "confirm the fee manually" instead of breaking checkout.
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  for (const candidate of buildAddressCandidates(address)) {
    const result = await geocodeOnce(candidate);
    if (result) return result;
  }
  return null;
}

// Great-circle ("as the crow flies") distance in km — deliberately not real
// driving distance, since that needs a paid routing API. Close enough to
// sort a local delivery address into a distance-based fee band; if this
// ever needs to match actual road distance, swap this call out for a
// routing API inside quoteDelivery() without touching its callers.
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
