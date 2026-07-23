import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { getPublicProductDetail } from "@/modules/storefront/queries";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { WriteReviewForm } from "@/components/storefront/write-review-form";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site-config";

// Consistent with /shop and the homepage — admin-editable, DB-backed
// content has no upside from build-time static generation here.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublicProductDetail(id);
  if (!data) return { title: "Product not found" };

  const { product } = data;
  const description = product.shortDescription ?? product.description ?? undefined;
  const canonical = `${SITE_URL}/shop/${id}`;

  return {
    // Short here, not "Name — Fudgee" — the (marketing) layout's title
    // template already appends "| Fudgee" to any plain string title.
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      type: "website",
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    twitter: {
      title: product.name,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPublicProductDetail(id);
  if (!data) notFound();

  const { product, breakdown, reviewCount, averageRating } = data;
  const price = product.sellPrice !== null ? Number(product.sellPrice) : null;
  const images = [product.imageUrl, ...product.images.map((i) => i.imageUrl)].filter(
    (src): src is string => !!src
  );
  const maxBreakdownCount = Math.max(1, ...breakdown.map((b) => b.count));
  const canonical = `${SITE_URL}/shop/${product.id}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "AUD",
      price: price !== null ? price.toFixed(2) : undefined,
      availability: "https://schema.org/InStock",
    },
    // Only included with real reviews — Google explicitly disallows a
    // fabricated aggregateRating with zero underlying reviews.
    ...(reviewCount > 0 && averageRating !== null
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: averageRating.toFixed(1), reviewCount } }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: product.name, item: canonical },
    ],
  };

  const infoSections = [
    { label: "Description", value: product.description },
    { label: "Ingredients", value: product.ingredients },
    { label: "Allergens", value: product.allergens },
    { label: "Nutrition Information", value: product.nutritionInfo },
    { label: "Storage Instructions", value: product.storageInstructions },
    { label: "Weight", value: product.weight },
    { label: "Shelf Life", value: product.shelfLife },
    { label: "Delivery Information", value: product.deliveryInfo },
  ].filter((s): s is { label: string; value: string } => !!s.value);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Link href="/shop" className="text-sm font-medium text-[var(--sf-muted)] hover:text-[var(--sf-fg)]">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="w-fit rounded-full bg-[var(--sf-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--sf-primary)]">
              {product.category.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            {product.name}
          </h1>

          {reviewCount > 0 && averageRating !== null && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-[var(--sf-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4" fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-semibold text-[var(--sf-fg)]">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-[var(--sf-muted)]">
                ({reviewCount} review{reviewCount === 1 ? "" : "s"})
              </span>
            </div>
          )}

          {product.shortDescription && <p className="text-[var(--sf-muted)]">{product.shortDescription}</p>}

          <div className="mt-2 flex items-center gap-4">
            <span className="text-2xl font-semibold text-[var(--sf-primary)]">
              {price !== null ? `$${price.toFixed(2)}` : "Ask us"}
            </span>
            <AddToCartButton productId={product.id} name={product.name} price={price} imageUrl={product.imageUrl} />
          </div>
        </div>
      </div>

      {infoSections.length > 0 && (
        <div className="mt-16 flex flex-col divide-y divide-[var(--sf-border)] rounded-3xl bg-[var(--sf-card)] ring-1 ring-[var(--sf-border)]">
          {infoSections.map((section) => (
            <div key={section.label} className="p-6">
              <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">{section.label}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-[var(--sf-muted)]">{section.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--sf-fg)]">
          Customer Reviews {reviewCount > 0 && `(${reviewCount})`}
        </h2>

        {reviewCount > 0 && averageRating !== null && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex shrink-0 flex-col items-center gap-1 sm:w-40">
              <span className="font-display text-4xl font-semibold text-[var(--sf-fg)]">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex gap-0.5 text-[var(--sf-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4" fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs text-[var(--sf-muted)]">{reviewCount} reviews</span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {breakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-10 shrink-0 text-[var(--sf-muted)]">{row.stars}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--sf-bg-alt)]">
                    <div
                      className="h-full rounded-full bg-[var(--sf-accent)]"
                      style={{ width: `${(row.count / maxBreakdownCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-[var(--sf-muted)]">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <WriteReviewForm productId={product.id} />
        </div>

        {product.reviews.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-2 rounded-2xl bg-[var(--sf-card)] p-5 ring-1 ring-[var(--sf-border)]">
                <div className="flex gap-0.5 text-[var(--sf-accent)]" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4" fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-[var(--sf-fg)]/90">&ldquo;{review.body}&rdquo;</p>
                <span className="text-sm font-semibold text-[var(--sf-muted)]">— {review.customerName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
