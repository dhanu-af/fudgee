import type { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";
import { getActiveDiscountPromotions } from "@/modules/storefront/queries";

export const metadata: Metadata = {
  title: "Your Cart",
  // Transactional, per-visitor content — not worth indexing.
  robots: { index: false, follow: true },
};

// Client-side cart state + a bound server action make this page unsuitable
// for static prerendering at build time — always render it per-request.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const discounts = await getActiveDiscountPromotions();
  return (
    <CartView
      discounts={discounts.map((d) => ({
        title: d.title,
        discountPercent: d.discountPercent!,
        minimumSpend: d.minimumSpend ? Number(d.minimumSpend) : null,
      }))}
    />
  );
}
