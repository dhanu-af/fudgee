type PromoCode = { code: string; discountPercent: number; expiresAt: Date | null };

export function PromoCodeCard({ promoCodes }: { promoCodes: PromoCode[] }) {
  if (promoCodes.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[var(--sf-card)] p-5 ring-1 ring-[var(--sf-border)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-muted)]">Your special offers</p>
      <div className="mt-3 flex flex-col gap-3">
        {promoCodes.map((promo) => (
          <div
            key={promo.code}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--sf-primary-soft)] px-4 py-3"
          >
            <div>
              <span className="font-mono text-lg font-bold tracking-wide text-[var(--sf-primary)]">
                {promo.code}
              </span>
              <p className="text-sm text-[var(--sf-muted)]">
                {promo.discountPercent}% off your order — enter this code at checkout
                {promo.expiresAt ? ` before ${new Date(promo.expiresAt).toLocaleDateString()}` : ""}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
