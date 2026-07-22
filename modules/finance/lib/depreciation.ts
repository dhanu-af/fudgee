// Straight-line depreciation only — matches Dhanu's other finance system
// exactly (no declining-balance option). Computed on the fly from the Asset
// register, never persisted as rows, so there's no cron/backfill to keep in
// sync — asOf/range are always evaluated fresh against purchaseDate.

export type AssetLike = {
  purchaseDate: Date;
  purchaseCost: number;
  salvageValue: number;
  depreciationPeriodMonths: number;
};

// Whole months elapsed from `from` to `to`, only counting a month once its
// day-of-month anniversary has passed — whole-month accounting, not
// calendar-day precision (matching the reference app).
function monthsElapsed(from: Date, to: Date): number {
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return to.getDate() >= from.getDate() ? months : months - 1;
}

export function monthlyDepreciation(asset: AssetLike): number {
  if (asset.depreciationPeriodMonths <= 0) return 0;
  return (asset.purchaseCost - asset.salvageValue) / asset.depreciationPeriodMonths;
}

function clampedMonthsElapsed(asset: AssetLike, asOf: Date): number {
  return Math.max(0, Math.min(monthsElapsed(asset.purchaseDate, asOf), asset.depreciationPeriodMonths));
}

export function accumulatedDepreciation(asset: AssetLike, asOf: Date): number {
  return monthlyDepreciation(asset) * clampedMonthsElapsed(asset, asOf);
}

export function bookValue(asset: AssetLike, asOf: Date): number {
  return asset.purchaseCost - accumulatedDepreciation(asset, asOf);
}

export function isFullyDepreciated(asset: AssetLike, asOf: Date): boolean {
  return monthsElapsed(asset.purchaseDate, asOf) >= asset.depreciationPeriodMonths;
}

// Depreciation expense recognized inside [from, to] — the overlap, in whole
// months, between the asset's depreciation window and the query range.
export function depreciationForRange(asset: AssetLike, from: Date, to: Date): number {
  const monthsInRange = clampedMonthsElapsed(asset, to) - clampedMonthsElapsed(asset, from);
  return monthlyDepreciation(asset) * Math.max(0, monthsInRange);
}

// A month-by-month schedule for the Asset detail page — one row per elapsed
// month plus the current (possibly partial) position, capped at the
// depreciation period so a fully-depreciated asset doesn't grow rows forever.
export function depreciationSchedule(asset: AssetLike, asOf: Date) {
  const monthly = monthlyDepreciation(asset);
  const totalMonths = clampedMonthsElapsed(asset, asOf);
  const rows: { month: number; date: Date; accumulated: number; bookValue: number }[] = [];
  for (let m = 1; m <= totalMonths; m++) {
    const date = new Date(asset.purchaseDate);
    date.setMonth(date.getMonth() + m);
    const accumulated = monthly * m;
    rows.push({ month: m, date, accumulated, bookValue: asset.purchaseCost - accumulated });
  }
  return rows;
}
