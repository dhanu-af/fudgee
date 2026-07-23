// Simple, informational tier system — purely a display/status layer over
// Customer.rewardsPoints, no redemption/spend mechanism yet (see the schema
// comment on RewardsLedgerEntry for why that's a deliberate follow-up).

export type RewardsTier = {
  name: "Bronze" | "Silver" | "Gold";
  pointsToNext: number | null;
};

const SILVER_THRESHOLD = 100;
const GOLD_THRESHOLD = 300;

export function getRewardsTier(points: number): RewardsTier {
  if (points >= GOLD_THRESHOLD) return { name: "Gold", pointsToNext: null };
  if (points >= SILVER_THRESHOLD) return { name: "Silver", pointsToNext: GOLD_THRESHOLD - points };
  return { name: "Bronze", pointsToNext: SILVER_THRESHOLD - points };
}
