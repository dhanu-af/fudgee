"use client";

import { useActionState, useState } from "react";
import { resolveOrderPayment, type ResolveOrderPaymentState } from "@/modules/storefront/checkout-actions";

export function OrderPaymentChooser({ orderId, total }: { orderId: string; total: number }) {
  const [state, formAction, pending] = useActionState<ResolveOrderPaymentState, FormData>(resolveOrderPayment, {});
  const [method, setMethod] = useState<"card" | "cash" | "payid">("card");
  const [phone, setPhone] = useState("");

  if (state.success) {
    return (
      <p className="text-sm font-medium text-[var(--sf-primary)]">
        Got it — we&apos;ll contact {phone} to arrange {method === "cash" ? "cash" : "PayID"} payment.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="method" value={method} />
      <span className="text-xs font-medium text-[var(--sf-muted)]">Choose how to pay</span>
      <div className="grid grid-cols-3 gap-2">
        {(["card", "cash", "payid"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
              method === m
                ? "border-[var(--sf-primary)] bg-[var(--sf-primary-soft)] text-[var(--sf-fg)]"
                : "border-[var(--sf-border)] bg-[var(--sf-bg)] text-[var(--sf-muted)]"
            }`}
          >
            {m === "card" ? "Card" : m === "cash" ? "Cash" : "PayID"}
          </button>
        ))}
      </div>
      {method !== "card" && (
        <input
          name="paymentPhone"
          required
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile number, e.g. 04XX XXX XXX"
          className="h-10 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-[var(--sf-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {pending
          ? method === "card"
            ? "Redirecting to payment..."
            : "Saving..."
          : method === "card"
            ? `Pay now — $${total.toFixed(2)}`
            : "Confirm"}
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
