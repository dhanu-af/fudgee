import type { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  // Transactional, per-visitor content — not worth indexing.
  robots: { index: false, follow: true },
};

// Client-side cart state + a bound server action make this page unsuitable
// for static prerendering at build time — always render it per-request.
export const dynamic = "force-dynamic";

export default function CartPage() {
  return <CartView />;
}
