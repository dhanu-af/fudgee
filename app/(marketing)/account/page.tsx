import type { Metadata } from "next";
import Link from "next/link";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerOrderHistory } from "@/modules/customer-account/queries";
import { OrderHistory } from "@/modules/customer-account/components/order-history";
import { SignOutButton } from "@/modules/customer-account/components/sign-out-button";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

// A signed-in customer's own order history — no upside from static
// generation for account-specific, DB-backed content.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await requireCustomer();
  const orders = await getCustomerOrderHistory(customer.id);

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

      <h2 className="mb-4 font-display text-xl font-semibold text-[var(--sf-fg)]">Your orders</h2>
      <OrderHistory orders={orders} />
    </div>
  );
}
