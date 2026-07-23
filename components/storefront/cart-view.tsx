"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";
import { createStripeCheckout } from "@/modules/storefront/checkout-actions";
import { gstComponent, applyDiscount } from "@/lib/storefront/gst";

type ActiveDiscount = { title: string; discountPercent: number } | null;

export function CartView({ discount }: { discount: ActiveDiscount }) {
  const { items, updateQuantity, removeItem, subtotal, gst } = useCart();
  const [state, formAction, pending] = useActionState(createStripeCheckout, {});
  const [showCheckout, setShowCheckout] = useState(false);

  // Mirrors checkout-actions.ts exactly: discount comes off the subtotal
  // first, then GST is recomputed on what's left — so this always matches
  // what Stripe will actually charge.
  const discountAmount = discount ? applyDiscount(subtotal, discount.discountPercent) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const discountedGst = discountAmount > 0 ? gstComponent(discountedSubtotal) : gst;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Your cart is empty</h1>
        <p className="text-[var(--sf-muted)]">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)]"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Your cart</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl bg-[var(--sf-card)] p-4 ring-1 ring-[var(--sf-border)]"
          >
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--sf-primary-soft)]">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="size-full object-cover" />
              ) : (
                <span className="font-display text-xl font-semibold text-[var(--sf-primary)]">
                  {item.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[var(--sf-fg)]">{item.name}</div>
              <div className="text-sm text-[var(--sf-muted)]">${item.price.toFixed(2)} each</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex size-8 items-center justify-center rounded-full bg-[var(--sf-bg-alt)] hover:bg-[var(--sf-primary-soft)]"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex size-8 items-center justify-center rounded-full bg-[var(--sf-bg-alt)] hover:bg-[var(--sf-primary-soft)]"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <div className="w-20 text-right font-semibold text-[var(--sf-fg)]">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.name} from cart`}
              onClick={() => removeItem(item.productId)}
              className="flex size-8 items-center justify-center rounded-full text-[var(--sf-muted)] hover:bg-[var(--sf-primary-soft)] hover:text-[var(--sf-fg)]"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2 rounded-2xl bg-[var(--sf-bg-alt)] p-5">
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--sf-muted)]">Subtotal</span>
            <span className="text-[var(--sf-muted)]">${subtotal.toFixed(2)}</span>
          </div>
        )}
        {discountAmount > 0 && discount && (
          <div className="flex items-center justify-between text-sm font-medium text-[var(--sf-primary)]">
            <span>
              {discount.discountPercent}% off ({discount.title})
            </span>
            <span>−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[var(--sf-fg)]">Total</span>
          <span className="text-2xl font-semibold text-[var(--sf-primary)]">${discountedSubtotal.toFixed(2)}</span>
        </div>
        <div className="text-right text-xs text-[var(--sf-muted)]">Includes ${discountedGst.toFixed(2)} GST</div>
      </div>

      {!showCheckout ? (
        <button
          type="button"
          onClick={() => setShowCheckout(true)}
          className="mt-6 w-full rounded-full bg-[var(--sf-primary)] py-4 text-center text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-[1.02]"
        >
          Pay Now
        </button>
      ) : (
        <form action={formAction} className="mt-8 flex flex-col gap-4 rounded-3xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)]">
          <h2 className="font-display text-xl font-semibold text-[var(--sf-fg)]">Your details</h2>
          <p className="text-sm text-[var(--sf-muted)]">
            We&apos;ll pass these on to our delivery team. You&apos;ll pay securely by card on the next step.
          </p>

          <input
            type="hidden"
            name="linesJson"
            value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customerName" className="text-sm font-medium text-[var(--sf-fg)]">Full name</label>
              <input id="customerName" name="customerName" required className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--sf-fg)]">Email</label>
              <input id="email" name="email" type="email" required className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-[var(--sf-fg)]">Phone (optional)</label>
            <input id="phone" name="phone" className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shippingAddress" className="text-sm font-medium text-[var(--sf-fg)]">Delivery address</label>
            <textarea id="shippingAddress" name="shippingAddress" required rows={2} className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--sf-primary)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-[var(--sf-fg)]">Notes (optional)</label>
            <textarea id="notes" name="notes" rows={2} placeholder="Delivery instructions, allergies, gift message..." className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--sf-primary)]" />
          </div>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-[var(--sf-primary)] py-4 text-center text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {pending ? "Redirecting to payment..." : `Pay now — $${discountedSubtotal.toFixed(2)}`}
          </button>
        </form>
      )}
    </div>
  );
}
