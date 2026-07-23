"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { sendTestWhatsAppMessage } from "@/modules/storefront/actions";

export function WhatsAppTestButton() {
  const [state, formAction, pending] = useActionState(sendTestWhatsAppMessage, {});

  return (
    <section className="flex max-w-2xl flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">WhatsApp integration test</h2>
      <p className="text-sm text-muted-foreground">
        Sends a one-off test message to every number in <code>ADMIN_WHATSAPP_NUMBER</code> (comma-separate multiple
        numbers) using the <code>WHATSAPP_ACCESS_TOKEN</code> / <code>WHATSAPP_PHONE_NUMBER_ID</code> configured in
        Vercel — the same connection the order and contact-form notifications use.
      </p>
      <form action={formAction}>
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Sending..." : "Send Test Message"}
        </Button>
      </form>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.results && (
        <ul className="flex flex-col gap-1">
          {state.results.map((r) => (
            <li key={r.to} className={`text-sm ${r.sent ? "text-primary" : "text-destructive"}`}>
              {r.to}: {r.sent ? "Sent" : `Failed — ${r.error ?? "unknown error"}`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
