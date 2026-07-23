import { getRewardsTier } from "@/modules/customer-account/lib/rewards";

const TIER_STYLES: Record<string, string> = {
  Bronze: "bg-amber-700/15 text-amber-700",
  Silver: "bg-slate-400/15 text-slate-500",
  Gold: "bg-yellow-500/15 text-yellow-600",
};

export function RewardsCard({ points }: { points: number }) {
  const tier = getRewardsTier(points);

  return (
    <div className="rounded-2xl bg-[var(--sf-card)] p-5 ring-1 ring-[var(--sf-border)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-muted)]">Rewards</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--sf-fg)]">{points} points</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${TIER_STYLES[tier.name]}`}>
          {tier.name} member
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--sf-muted)]">
        {tier.pointsToNext !== null
          ? `Earn 1 point per $1 spent — ${tier.pointsToNext} more points to reach the next tier.`
          : "Earn 1 point per $1 spent — you've reached our top tier!"}
      </p>
    </div>
  );
}
