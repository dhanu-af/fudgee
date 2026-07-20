import Link from "next/link";
import { Reveal } from "@/components/storefront/reveal";

type Category = { id: string; name: string; slug: string; products: unknown[] };

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const withProducts = categories.filter((c) => c.products.length > 0);
  if (withProducts.length === 0) return null;

  return (
    <section id="categories" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Explore</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
          Shop by category
        </h2>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {withProducts.map((category, i) => (
          <Reveal key={category.id} delay={i * 0.06}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-[var(--sf-card)] p-8 text-center ring-1 ring-[var(--sf-border)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--sf-primary)]/10"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] font-display text-2xl font-semibold text-[var(--sf-primary)] transition-transform group-hover:scale-110">
                {category.name.charAt(0)}
              </div>
              <span className="font-semibold text-[var(--sf-fg)]">{category.name}</span>
              <span className="text-xs text-[var(--sf-muted)]">{category.products.length} items</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
