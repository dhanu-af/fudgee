"use client";

import { useActionState } from "react";
import { createPayNowSession, type PayNowFormState } from "@/modules/storefront/checkout-actions";

export function PayNowButton({ orderId, total }: { orderId: string; total: number }) {
  const [state, formAction, pending] = useActionState<PayNowFormState, FormData>(createPayNowSession, {});

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {pending ? "Redirecting to payment..." : `Pay now by card — $${total.toFixed(2)}`}
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
