import { db } from "@/lib/db";
import { MODULE_REGISTRY } from "@/lib/registry/modules";
import { getStockLevels } from "@/modules/inventory/queries";

const BUILT_MODULE_KEYS = new Set([
  "dashboard",
  "products",
  "customers",
  "users",
  "warehouse",
  "inventory",
  "sales_orders",
  "purchase_orders",
  "production",
  "quality",
]);

export async function getDashboardData() {
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [
    productCount,
    customerCount,
    activeUserCount,
    productsByType,
    recentProducts,
    recentCustomers,
    recentUsers,
    productsSince,
    customersSince,
  ] = await Promise.all([
    db.product.count(),
    db.customer.count(),
    db.user.count({ where: { isActive: true } }),
    db.product.groupBy({ by: ["type"], _count: { _all: true } }),
    db.product.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, sku: true, createdAt: true } }),
    db.customer.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, createdAt: true } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, createdAt: true } }),
    db.product.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.customer.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  const activity = [
    ...recentProducts.map((p) => ({ id: `product-${p.id}`, label: `Product created: ${p.name} (${p.sku})`, createdAt: p.createdAt })),
    ...recentCustomers.map((c) => ({ id: `customer-${c.id}`, label: `Customer added: ${c.name}`, createdAt: c.createdAt })),
    ...recentUsers.map((u) => ({ id: `user-${u.id}`, label: `User created: ${u.name}`, createdAt: u.createdAt })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  const days: { date: string; label: string; products: number; customers: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      products: 0,
      customers: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.date, i]));
  for (const p of productsSince) {
    const key = p.createdAt.toISOString().slice(0, 10);
    const i = dayIndex.get(key);
    if (i !== undefined) days[i].products += 1;
  }
  for (const c of customersSince) {
    const key = c.createdAt.toISOString().slice(0, 10);
    const i = dayIndex.get(key);
    if (i !== undefined) days[i].customers += 1;
  }

  const typeLabels: Record<string, string> = {
    FINISHED_GOOD: "Finished good",
    RAW_MATERIAL: "Raw material",
    PACKAGING: "Packaging",
  };
  const productTypeChart = productsByType.map((row) => ({
    type: typeLabels[row.type] ?? row.type,
    count: row._count._all,
  }));

  const builtModules = MODULE_REGISTRY.filter((m) => BUILT_MODULE_KEYS.has(m.key)).length;
  const totalModules = MODULE_REGISTRY.length;

  const stockLevels = await getStockLevels();
  const inventorySummary = {
    skuLocationCount: stockLevels.length,
    totalUnitsOnHand: stockLevels.reduce((sum, row) => sum + Math.max(row.onHand, 0), 0),
  };

  const [activeBatchCount, completedBatchCount] = await Promise.all([
    db.productionBatch.count({ where: { status: { in: ["PLANNED", "IN_PROGRESS"] } } }),
    db.productionBatch.count({ where: { status: "COMPLETED" } }),
  ]);
  const productionSummary = { activeBatchCount, completedBatchCount };

  const [passCount, failCount, pendingCount] = await Promise.all([
    db.qualityCheck.count({ where: { result: "PASS" } }),
    db.qualityCheck.count({ where: { result: "FAIL" } }),
    db.qualityCheck.count({ where: { result: "PENDING" } }),
  ]);
  const totalChecks = passCount + failCount + pendingCount;
  const qualitySummary = {
    passCount,
    failCount,
    pendingCount,
    passRate: totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : null,
  };

  return {
    kpis: { productCount, customerCount, activeUserCount },
    productTypeChart,
    activityChart: days,
    activity,
    buildProgress: { built: builtModules, total: totalModules },
    inventorySummary,
    productionSummary,
    qualitySummary,
  };
}
