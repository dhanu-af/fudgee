"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";
import { isOptimizableImageUrl } from "@/lib/utils";

// Mounted once in the marketing layout, always in the DOM — toggling
// visibility/transform classes (rather than conditionally rendering) is
// what lets the slide-out transition actually play on close, not just on
// open.
export function MiniCartDrawer() {
  const { items, updateQuantity, removeItem, subtotal, isDrawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
        isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isDrawerOpen}
    >
      <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[var(--sf-card)] shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--sf-border)] px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">
            Your Box {items.length > 0 && `(${items.reduce((sum, i) => sum + i.quantity, 0)})`}
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="flex size-8 items-center justify-center rounded-full text-[var(--sf-muted)] hover:bg-[var(--sf-bg-alt)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--sf-muted)]">Your box is empty — for now.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[var(--sf-bg-alt)]">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized={!isOptimizableImageUrl(item.imageUrl)}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--sf-fg)]">{item.name}</p>
                    <p className="text-xs text-[var(--sf-muted)]">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Remove one ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex size-7 items-center justify-center rounded-full ring-1 ring-[var(--sf-border)] hover:bg-[var(--sf-bg-alt)]"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex size-7 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] text-[var(--sf-primary)] hover:bg-[var(--sf-primary)] hover:text-[var(--sf-primary-foreground)]"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeItem(item.productId)}
                    className="shrink-0 text-xs font-semibold text-[var(--sf-muted)] hover:text-[var(--sf-fg)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-[var(--sf-border)] px-5 py-4">
            <div className="flex items-center justify-between text-sm font-semibold text-[var(--sf-fg)]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="rounded-full bg-[var(--sf-primary)] px-6 py-3 text-center text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105"
            >
              View Cart &amp; Checkout
            </Link>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full px-6 py-2 text-center text-sm font-semibold text-[var(--sf-muted)] hover:text-[var(--sf-fg)]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
