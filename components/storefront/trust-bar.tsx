import { Package, ShieldCheck, Star } from "lucide-react";

type Props = {
  orderCount: number;
  avgRating: number | null;
  reviewCount: number;
};

// Sits directly under the hero, above the fold — the moment someone's
// deciding whether a $6 fudge cookie is worth it. Both stats are real,
// computed from live data (not a hardcoded "500+" that goes stale): order
// count rounds down to the nearest 50 so it reads as a milestone, not an
// oddly precise figure, and disappears below 50 rather than showing "0+".
export function TrustBar({ orderCount, avgRating, reviewCount }: Props) {
  const roundedOrders = Math.floor(orderCount / 50) * 50;
  const showOrders = roundedOrders >= 50;
  const showRating = avgRating !== null && reviewCount > 0;

  return (
    <section className="border-y border-[var(--sf-border)] bg-[var(--sf-card)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 sm:px-8">
        {showOrders && (
          <div className="flex items-center gap-2.5">
            <Package className="size-5 shrink-0 text-[var(--sf-primary)]" />
            <span className="text-sm text-[var(--sf-fg)]">
              <strong className="font-display font-semibold">{roundedOrders}+</strong>{" "}
              <span className="text-[var(--sf-muted)]">Orders Delivered</span>
            </span>
          </div>
        )}
        {showRating && (
          <div className="flex items-center gap-2.5">
            <Star className="size-5 shrink-0 fill-[var(--sf-accent)] text-[var(--sf-accent)]" />
            <span className="text-sm text-[var(--sf-fg)]">
              <strong className="font-display font-semibold">{avgRating!.toFixed(1)}</strong>{" "}
              <span className="text-[var(--sf-muted)]">
                from {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-5 shrink-0 text-[var(--sf-primary)]" />
          <span className="text-sm text-[var(--sf-muted)]">Secure checkout — Card &amp; PayID</span>
        </div>
      </div>
    </section>
  );
}
