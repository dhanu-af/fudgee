"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";

export type StorefrontProduct = {
  id: string;
  name: string;
  shortDescription: string | null;
  imageUrl: string | null;
  sellPrice: unknown;
  category?: { name: string } | null;
};

const PLACEHOLDER_GRADIENTS = [
  "from-[var(--sf-primary-soft)] to-[var(--sf-accent-soft)]",
  "from-[var(--sf-accent-soft)] to-[var(--sf-primary-soft)]",
];

export function ProductCard({ product, index = 0 }: { product: StorefrontProduct; index?: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const price = product.sellPrice !== null ? Number(product.sellPrice) : null;

  function handleAdd() {
    if (price === null) return;
    addItem({ productId: product.id, name: product.name, price, imageUrl: product.imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-[var(--sf-card)] ring-1 ring-[var(--sf-border)] transition-shadow hover:shadow-lg hover:shadow-[var(--sf-primary)]/10">
      <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex size-full items-center justify-center bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[index % 2]} font-display text-4xl font-semibold text-[var(--sf-primary)]`}
          >
            {product.name.charAt(0)}
          </div>
        )}
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--sf-card)]/90 px-3 py-1 text-xs font-semibold text-[var(--sf-fg)] backdrop-blur">
            {product.category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--sf-fg)] hover:underline">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="line-clamp-2 flex-1 text-sm text-[var(--sf-muted)]">{product.shortDescription}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-[var(--sf-primary)]">
            {price !== null ? `$${price.toFixed(2)}` : "Ask us"}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={price === null}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 rounded-full bg-[var(--sf-primary)] px-4 py-2 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-50"
          >
            {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
