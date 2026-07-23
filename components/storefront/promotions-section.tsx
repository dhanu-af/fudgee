import Link from "next/link";

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
};

export function PromotionsSection({ promotions }: { promotions: Promotion[] }) {
  if (promotions.length === 0) return null;

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8">
      {promotions.map((promo) => (
        <div
          key={promo.id}
          className="relative overflow-hidden rounded-3xl ring-1 ring-[var(--sf-border)]"
        >
          {promo.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={promo.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
          )}
          <div
            className={
              promo.imageUrl
                ? "relative flex flex-col items-start gap-3 bg-gradient-to-r from-black/70 via-black/40 to-transparent p-6 sm:p-10"
                : "relative flex flex-col items-start gap-3 bg-[var(--sf-primary-soft)] p-6 sm:p-10"
            }
          >
            <h2
              className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
                promo.imageUrl ? "text-white" : "text-[var(--sf-fg)]"
              }`}
            >
              {promo.title}
            </h2>
            {promo.description && (
              <p className={`max-w-xl ${promo.imageUrl ? "text-white/90" : "text-[var(--sf-muted)]"}`}>
                {promo.description}
              </p>
            )}
            <Link
              href={promo.linkUrl || "/shop"}
              className="mt-1 rounded-full bg-[var(--sf-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
            >
              {promo.linkLabel || "Shop Now"}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
