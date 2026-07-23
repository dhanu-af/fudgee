import type { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";
import { getBestActiveDiscount } from "@/modules/storefront/queries";

export const metadata: Metadata = {
  title: "Your Cart",
  // Transactional, per-visitor content — not worth indexing.
  robots: { index: false, follow: true },
};

// Client-side cart state + a bound server action make this page unsuitable
// for static prerendering at build time — always render it per-request.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const discount = await getBestActiveDiscount();
  return (
    <CartView
      discount={discount ? { title: discount.title, discountPercent: discount.discountPercent! } : null}
    />
  );
}
