import Stripe from "stripe";

// Constructed lazily (only when actually called) rather than at module load —
// eagerly constructing with an empty key crashed Next's build-time "Collecting
// page data" step for any route that imports this file, even when Stripe is
// never actually called during the build.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}
