import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getStripe } from "@/lib/stripe";

// Temporary, admin-only diagnostic for the "checkout still shows Sandbox"
// investigation — reports which Stripe mode the production server is
// actually operating in, straight from Stripe's own API response, rather
// than trusting what the dashboard *says* is configured. Never returns the
// secret key itself (only its 8-char prefix) and never the webhook secret's
// value. Safe to leave in place; delete once the mode mismatch is resolved.
export async function GET() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const rawKey = process.env.STRIPE_SECRET_KEY;
  const keyPresent = Boolean(rawKey);
  const keyPrefix = rawKey ? rawKey.slice(0, 8) : null;

  const result: Record<string, unknown> = {
    keyPresent,
    keyPrefix, // "sk_live_" or "sk_test_" — never the full key
    webhookSecretPresent: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
  };

  if (!keyPresent) {
    return NextResponse.json({ ...result, error: "STRIPE_SECRET_KEY is not set at runtime" }, { status: 200 });
  }

  try {
    // Balance.retrieve() and Accounts.retrieve() are both read-only, have no
    // side effects, and — critically — Balance's `livemode` field is
    // Stripe's own authoritative answer for which mode a key is actually
    // operating in, independent of what the key's prefix appears to be.
    const stripe = getStripe();
    const [balance, account] = await Promise.all([stripe.balance.retrieve(), stripe.accounts.retrieveCurrent()]);

    result.stripeReportedLivemode = balance.livemode;
    result.stripeAccountId = account.id;
    result.stripeAccountEmail = account.email ?? null;
    result.stripeAccountCountry = account.country ?? null;
  } catch (err) {
    const stripeErr = err as { type?: string; code?: string; message?: string };
    result.error = "Stripe API call failed";
    result.errorType = stripeErr.type ?? null;
    result.errorCode = stripeErr.code ?? null;
    // Stripe's own error messages for bad keys never include the key itself,
    // so this is safe to surface as-is.
    result.errorMessage = stripeErr.message ?? String(err);
  }

  return NextResponse.json(result);
}
