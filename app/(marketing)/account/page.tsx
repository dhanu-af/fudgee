import type { Metadata } from "next";
import Link from "next/link";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerOrderHistory } from "@/modules/customer-account/queries";
import { getActivePromotions, getStorefrontSettings } from "@/modules/storefront/queries";
import { OrderHistory } from "@/modules/customer-account/components/order-history";
import { SignOutButton } from "@/modules/customer-account/components/sign-out-button";
import { RewardsCard } from "@/modules/customer-account/components/rewards-card";
import { WhatsAppCommunityCard } from "@/modules/customer-account/components/whatsapp-community-card";
import { FacebookFanPageCard } from "@/components/storefront/facebook-fanpage-card";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

// A signed-in customer's own order history — no upside from static
// generation for account-specific, DB-backed content.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await requireCustomer();
  const [orders, promotions, settings] = await Promise.all([
    getCustomerOrderHistory(customer.id),
    getActivePromotions(),
    getStorefrontSettings(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)]">
            Hi, {customer.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-[var(--sf-muted)]">{customer.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/shop" className="text-sm font-semibold text-[var(--sf-primary)] hover:underline">
            Continue shopping
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <WhatsAppCommunityCard url={settings?.whatsappCommunityUrl ?? null} />
        <FacebookFanPageCard url={settings?.facebookFanPageUrl ?? null} />
      </div>

      <div className="mb-8">
        <RewardsCard points={customer.rewardsPoints} />
      </div>

      {promotions.length > 0 && (
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold text-[var(--sf-fg)]">Current Promotions</h2>
          {promotions.map((promo) => (
            <div key={promo.id} className="rounded-2xl bg-[var(--sf-primary-soft)] p-4">
              <p className="font-semibold text-[var(--sf-fg)]">{promo.title}</p>
              {promo.description && <p className="text-sm text-[var(--sf-muted)]">{promo.description}</p>}
              <Link
                href={promo.linkUrl || "/shop"}
                className="mt-2 inline-block text-sm font-semibold text-[var(--sf-primary)] hover:underline"
              >
                {promo.linkLabel || "Shop Now"} →
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 font-display text-xl font-semibold text-[var(--sf-fg)]">Your orders</h2>
      <OrderHistory orders={orders} />
    </div>
  );
}
