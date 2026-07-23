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
        Sends a one-off test message to <code>ADMIN_WHATSAPP_NUMBER</code> using the{" "}
        <code>WHATSAPP_ACCESS_TOKEN</code> / <code>WHATSAPP_PHONE_NUMBER_ID</code> configured in Vercel — the same
        connection the order notification will use once it's turned on.
      </p>
      <form action={formAction}>
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Sending..." : "Send Test Message"}
        </Button>
      </form>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-primary">Sent — check your WhatsApp for &quot;Fudgee WhatsApp integration is working successfully.&quot;</p>
      )}
    </section>
  );
}
