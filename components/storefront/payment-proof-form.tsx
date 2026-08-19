"use client";

import { useActionState } from "react";
import { submitPaymentProof, type PaymentProofState } from "@/modules/storefront/checkout-actions";

export function PaymentProofForm({
  orderId,
  existingReference,
  existingReceiptUrl,
}: {
  orderId: string;
  existingReference: string | null;
  existingReceiptUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState<PaymentProofState, FormData>(submitPaymentProof, {});

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <span className="text-xs font-medium text-[var(--sf-muted)]">
        {existingReference || existingReceiptUrl ? "Payment proof submitted — update it below" : "Paid already? Submit proof"}
      </span>
      <input
        name="referenceNumber"
        defaultValue={existingReference ?? ""}
        placeholder="Bank transfer / PayID reference number"
        className="h-10 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
      />
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="text-sm text-[var(--sf-muted)]"
      />
      {existingReceiptUrl && (
        <a href={existingReceiptUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--sf-primary)] underline">
          View previously submitted receipt
        </a>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit rounded-full bg-[var(--sf-primary)] px-5 py-2 text-sm font-semibold text-[var(--sf-primary-foreground)] disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit payment proof"}
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-sm font-medium text-[var(--sf-primary)]">Thanks — we&apos;ll confirm your payment shortly.</p>
      )}
    </form>
  );
}
