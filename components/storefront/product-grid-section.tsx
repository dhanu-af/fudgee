import Link from "next/link";
import { Reveal } from "@/components/storefront/reveal";
import { ProductCard, type StorefrontProduct } from "@/components/storefront/product-card";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  products: StorefrontProduct[];
};

export function ProductGridSection({ id, eyebrow, title, subtitle, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">{eyebrow}</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="max-w-lg text-[var(--sf-muted)]">{subtitle}</p>}
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.06}>
            <ProductCard product={product} index={i} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="rounded-full border border-[var(--sf-border)] px-6 py-3 text-sm font-semibold text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
        >
          View full shop
        </Link>
      </div>
    </section>
  );
}
