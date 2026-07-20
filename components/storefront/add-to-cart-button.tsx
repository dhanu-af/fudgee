"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";

export function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
}: {
  productId: string;
  name: string;
  price: number | null;
  imageUrl: string | null;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (price === null) return;
    addItem({ productId, name, price, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={price === null}
      className="flex items-center justify-center gap-2 rounded-full bg-[var(--sf-primary)] px-8 py-3.5 text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-105 disabled:opacity-50"
    >
      {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
      {added ? "Added to cart" : "Add to Cart"}
    </button>
  );
}
