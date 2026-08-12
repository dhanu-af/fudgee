import { Resend } from "resend";

// Constructed lazily, same reason as lib/stripe.ts's getStripe() — building
// with an empty key at module load crashes Next's build-time page-data
// collection even when email is never actually sent during the build.
let client: Resend | null = null;

function getResend(): Resend {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

// No verified sending domain is required to start — Resend's shared
// onboarding@resend.dev sender works immediately. Once fudgee.au is
// verified in Resend, set RESEND_FROM_EMAIL to send as the real domain
// instead (e.g. "Fudgee <orders@fudgee.au>").
const DEFAULT_FROM = "Fudgee <onboarding@resend.dev>";

// Shared body for both order-notification emails (placed and paid) so the
// two call sites (checkout-actions.ts, webhooks/stripe/route.ts) don't each
// hand-roll their own markup.
export function orderNotificationEmailHtml(args: {
  orderNumber: string;
  customerName: string;
  total: number;
  orderUrl: string;
  paid: boolean;
}): string {
  const { orderNumber, customerName, total, orderUrl, paid } = args;
  return `
    <div style="font-family: sans-serif; font-size: 15px; color: #3e1f1a;">
      <p style="font-size: 17px; font-weight: 600;">${paid ? "💰 Order paid" : "🛒 New order placed"}</p>
      <p>
        <strong>${orderNumber}</strong> from <strong>${customerName}</strong> —
        $${total.toFixed(2)} AUD${paid ? "" : " (payment pending)"}
      </p>
      <p><a href="${orderUrl}" style="color: #9372c8;">View order in Operations</a></p>
    </div>
  `;
}

export type AdminEmailResult = { to: string; sent: boolean; error?: string };

// ADMIN_EMAIL may hold one address or a comma-separated list, same
// convention as ADMIN_WHATSAPP_NUMBER in lib/whatsapp.ts — every caller that
// emails "the admin" goes through here so a second recipient only needs
// adding in one place.
export async function notifyAdminsByEmail(subject: string, html: string): Promise<AdminEmailResult[]> {
  const addresses = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (addresses.length === 0) {
    return [];
  }

  if (!process.env.RESEND_API_KEY) {
    return addresses.map((to) => ({ to, sent: false, error: "not_configured" }));
  }

  const results: AdminEmailResult[] = [];
  for (const to of addresses) {
    try {
      const { error } = await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM,
        to,
        subject,
        html,
      });
      results.push(error ? { to, sent: false, error: error.message } : { to, sent: true });
    } catch (err) {
      results.push({ to, sent: false, error: err instanceof Error ? err.message : "Unknown error" });
    }
  }
  return results;
}
