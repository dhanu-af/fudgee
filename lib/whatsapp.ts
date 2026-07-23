const GRAPH_API_VERSION = "v21.0";

/**
 * Meta's Cloud API requires E.164 (country code, no leading 0). Numbers are
 * often entered in local Australian format (e.g. "0433517390"), so normalize
 * that case specifically.
 */
function toE164AU(to: string): string {
  const digits = to.replace(/\D/g, "");
  return digits.startsWith("0") ? `61${digits.slice(1)}` : digits;
}

/**
 * Sends a plain-text WhatsApp message via Meta's WhatsApp Cloud API. Returns
 * { sent: false, reason: "not_configured" } when WHATSAPP_ACCESS_TOKEN/WHATSAPP_PHONE_NUMBER_ID
 * aren't set, so callers can skip sending rather than throwing.
 */
export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<{ sent: true } | { sent: false; reason: "not_configured" | "api_error"; error?: string }> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return { sent: false, reason: "not_configured" };
  }

  const digitsOnly = toE164AU(to);

  const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: digitsOnly,
      type: "text",
      text: { body: text },
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    return { sent: false, reason: "api_error", error: body?.error?.message ?? `HTTP ${response.status}` };
  }

  return { sent: true };
}

export type AdminNotifyResult = { to: string; sent: boolean; error?: string };

// ADMIN_WHATSAPP_NUMBER may hold one number or a comma-separated list — every
// caller that notifies "the admin" (order placed, order paid, contact form,
// the test button) goes through here so they all reach every configured
// recipient the same way, without each call site re-implementing the split.
export async function notifyAdmins(text: string): Promise<AdminNotifyResult[]> {
  const numbers = (process.env.ADMIN_WHATSAPP_NUMBER ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  const results: AdminNotifyResult[] = [];
  for (const to of numbers) {
    try {
      const result = await sendWhatsAppMessage(to, text);
      results.push(result.sent ? { to, sent: true } : { to, sent: false, error: result.error ?? result.reason });
    } catch (err) {
      results.push({ to, sent: false, error: err instanceof Error ? err.message : "Unknown error" });
    }
  }
  return results;
}
