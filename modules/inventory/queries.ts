import { db } from "@/lib/db";

// Current stock is computed from the InventoryTransaction ledger (a signed
// sum), not stored in a separate mutable balance table — avoids a second
// write path that could drift out of sync with the ledger.
export async function getStockLevels() {
  const grouped = await db.inventoryTransaction.groupBy({
    by: ["productId", "locationId"],
    _sum: { quantity: true },
  });

  const productIds = [...new Set(grouped.map((g) => g.productId))];
  const locationIds = [...new Set(grouped.map((g) => g.locationId))];

  const [products, locations] = await Promise.all([
    db.product.findMany({ where: { id: { in: productIds } }, select: { id: true, sku: true, name: true } }),
    db.location.findMany({ where: { id: { in: locationIds } }, select: { id: true, name: true } }),
  ]);
  const productMap = new Map(products.map((p) => [p.id, p]));
  const locationMap = new Map(locations.map((l) => [l.id, l]));

  return grouped
    .map((g) => ({
      productId: g.productId,
      locationId: g.locationId,
      productSku: productMap.get(g.productId)?.sku ?? "—",
      productName: productMap.get(g.productId)?.name ?? "Unknown product",
      locationName: locationMap.get(g.locationId)?.name ?? "Unknown location",
      onHand: Number(g._sum.quantity ?? 0),
    }))
    .filter((row) => row.onHand !== 0)
    .sort((a, b) => a.productName.localeCompare(b.productName));
}

export function getRecentTransactions() {
  return db.inventoryTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      product: { select: { sku: true, name: true } },
      location: { select: { name: true } },
    },
  });
}

export function getProductOptions() {
  return db.product.findMany({ where: { status: "ACTIVE" }, select: { id: true, sku: true, name: true }, orderBy: { name: "asc" } });
}

export function getActiveLocationOptions() {
  return db.location.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}
