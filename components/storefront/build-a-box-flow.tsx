"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";

export type BoxProduct = {
  id: string;
  name: string;
  shortDescription: string | null;
  imageUrl: string | null;
  price: number | null;
};

const BOX_SIZES = [6, 12, 24];

// Pure curation on top of the existing catalog and cart — every flavour is
// flat-priced, so a "box" isn't a new pricing model (no bundle discount
// invented here, that's a business call for Dhanu to make later), just a
// friendlier way to fill a fixed-size pack with any mix of flavours before
// it all lands in the normal cart as ordinary line items.
export function BuildABoxFlow({ products }: { products: BoxProduct[] }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [boxSize, setBoxSize] = useState<number>(BOX_SIZES[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const total = useMemo(() => Object.values(quantities).reduce((sum, q) => sum + q, 0), [quantities]);
  const remaining = boxSize - total;
  const isFull = remaining === 0 && total > 0;

  const priceTotal = useMemo(
    () => products.reduce((sum, p) => sum + (quantities[p.id] ?? 0) * (p.price ?? 0), 0),
    [products, quantities]
  );

  function changeBoxSize(size: number) {
    setBoxSize(size);
    setQuantities({});
  }

  function adjust(productId: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[productId] ?? 0;
      if (delta > 0 && remaining <= 0) return prev;
      const next = current + delta;
      if (next < 0) return prev;
      return { ...prev, [productId]: next };
    });
  }

  function handleAddBox() {
    for (const product of products) {
      const qty = quantities[product.id] ?? 0;
      if (qty > 0 && product.price !== null) {
        addItem(
          { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl },
          qty
        );
      }
    }
    router.push("/cart");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-center gap-2">
        {BOX_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => changeBoxSize(size)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              boxSize === size
                ? "bg-[var(--sf-primary)] text-[var(--sf-primary-foreground)]"
                : "bg-[var(--sf-card)] text-[var(--sf-fg)] ring-1 ring-[var(--sf-border)] hover:bg-[var(--sf-primary-soft)]"
            }`}
          >
            {size}-Pack
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--sf-fg)]">
          <span>
            {total} of {boxSize} selected
          </span>
          <span className="text-[var(--sf-muted)]">{remaining > 0 ? `${remaining} to go` : "Box full"}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--sf-bg-alt)]">
          <div
            className="h-full rounded-full bg-[var(--sf-primary)] transition-all duration-300"
            style={{ width: `${Math.min(100, (total / boxSize) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[var(--sf-border)] overflow-hidden rounded-3xl bg-[var(--sf-card)] ring-1 ring-[var(--sf-border)]">
        {products.map((product) => {
          const qty = quantities[product.id] ?? 0;
          return (
            <div key={product.id} className="flex items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-[var(--sf-fg)]">{product.name}</p>
                {product.shortDescription && (
                  <p className="line-clamp-1 text-sm text-[var(--sf-muted)]">{product.shortDescription}</p>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold text-[var(--sf-primary)]">
                {product.price !== null ? `$${product.price.toFixed(2)}` : "Ask us"}
              </span>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  aria-label={`Remove one ${product.name}`}
                  onClick={() => adjust(product.id, -1)}
                  disabled={qty === 0}
                  className="flex size-8 items-center justify-center rounded-full ring-1 ring-[var(--sf-border)] transition-colors hover:bg-[var(--sf-bg-alt)] disabled:opacity-30"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-4 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button
                  type="button"
                  aria-label={`Add one ${product.name}`}
                  onClick={() => adjust(product.id, 1)}
                  disabled={remaining <= 0 || product.price === null}
                  className="flex size-8 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] text-[var(--sf-primary)] transition-colors hover:bg-[var(--sf-primary)] hover:text-[var(--sf-primary-foreground)] disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-[var(--sf-fg)] px-6 py-4 text-[var(--sf-bg)] shadow-lg">
        <span className="text-sm font-semibold">
          {isFull ? `${boxSize}-pack — $${priceTotal.toFixed(2)}` : "Fill your box to add it"}
        </span>
        <button
          type="button"
          onClick={handleAddBox}
          disabled={!isFull}
          className="shrink-0 rounded-full bg-[var(--sf-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          Add Box to Cart
        </button>
      </div>
    </div>
  );
}
