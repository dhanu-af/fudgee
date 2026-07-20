import type { Metadata } from "next";
import Link from "next/link";
import { getShopProducts, getCategories } from "@/modules/storefront/queries";
import { ProductCard } from "@/components/storefront/product-card";

export const metadata: Metadata = {
  title: "Shop — Fudgee",
  description: "Browse our full range of handcrafted fudge and confections.",
};

// Catalog is admin-editable and filterable by a query param — not a good
// static-generation candidate, so always render per-request.
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getShopProducts(), getCategories()]);
  const activeCategories = categories.filter((c) => c.isActive);

  const filtered = category ? products.filter((p) => p.category?.slug === category) : products;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Shop</span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--sf-fg)]">
          Our full range
        </h1>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <Link
          href="/shop"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            !category
              ? "bg-[var(--sf-primary)] text-[var(--sf-primary-foreground)]"
              : "bg-[var(--sf-card)] text-[var(--sf-fg)] ring-1 ring-[var(--sf-border)] hover:bg-[var(--sf-primary-soft)]"
          }`}
        >
          All
        </Link>
        {activeCategories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              category === c.slug
                ? "bg-[var(--sf-primary)] text-[var(--sf-primary-foreground)]"
                : "bg-[var(--sf-card)] text-[var(--sf-fg)] ring-1 ring-[var(--sf-border)] hover:bg-[var(--sf-primary-soft)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-[var(--sf-muted)]">No products here yet — check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
