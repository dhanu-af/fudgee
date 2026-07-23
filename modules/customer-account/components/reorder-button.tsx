"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/storefront/cart-context";

type ReorderLine = {
  productId: string;
  name: string;
  sellPrice: unknown;
  imageUrl: string | null;
  quantity: unknown;
};

export function ReorderButton({ lines }: { lines: ReorderLine[] }) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleReorder() {
    for (const line of lines) {
      // No current price means the product isn't sold this way anymore —
      // skip it rather than add a broken $0 line to the cart.
      if (line.sellPrice == null) continue;
      addItem(
        { productId: line.productId, name: line.name, price: Number(line.sellPrice), imageUrl: line.imageUrl },
        Number(line.quantity)
      );
    }
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      className="rounded-full border border-[var(--sf-border)] px-4 py-2 text-sm font-semibold text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
    >
      Reorder
    </button>
  );
}
