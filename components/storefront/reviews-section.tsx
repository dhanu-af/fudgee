import { Star } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";

type Review = { id: string; customerName: string; rating: number; body: string };

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Reviews</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
          Loved by our customers
        </h2>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={i * 0.07}>
            <div className="flex h-full flex-col gap-3 rounded-3xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)]">
              <div className="flex gap-0.5 text-[var(--sf-accent)]" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4" fill={s < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[var(--sf-fg)]/90">&ldquo;{review.body}&rdquo;</p>
              <span className="text-sm font-semibold text-[var(--sf-muted)]">— {review.customerName}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
