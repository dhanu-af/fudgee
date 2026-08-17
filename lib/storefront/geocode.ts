type LatLng = { lat: number; lng: number };

// Nominatim (OpenStreetMap) — free, no API key, no Vercel env var for Dhanu
// to manage. Its usage policy requires an identifying User-Agent and caps
// requests to ~1/second, which this storefront's order volume is nowhere
// near. Returns null (never throws) on any failure so callers can fall back
// to "confirm the fee manually" instead of breaking checkout.
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
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
    console.error("Geocoding failed for address:", trimmed, err);
    return null;
  }
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
