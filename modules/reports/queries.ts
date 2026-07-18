import { db } from "@/lib/db";
import { getStockLevels } from "@/modules/inventory/queries";

export async function getReportsData() {
  const [
    salesOrdersByStatus,
    salesOrdersTotal,
    purchaseOrdersByStatus,
    purchaseOrdersTotal,
    productionByStatus,
    qualityByResult,
    stockLevels,
    products,
  ] = await Promise.all([
    db.salesOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    db.salesOrder.aggregate({ _sum: { total: true } }),
    db.purchaseOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    db.purchaseOrder.aggregate({ _sum: { total: true } }),
    db.productionBatch.groupBy({ by: ["status"], _count: { _all: true }, _sum: { quantityActual: true } }),
    db.qualityCheck.groupBy({ by: ["result"], _count: { _all: true } }),
    getStockLevels(),
    db.product.findMany({ select: { id: true, costPrice: true } }),
  ]);

  const costByProduct = new Map(products.map((p) => [p.id, p.costPrice ? Number(p.costPrice) : 0]));
  const inventoryValuation = stockLevels.reduce(
    (sum, row) => sum + row.onHand * (costByProduct.get(row.productId) ?? 0),
    0
  );

  return {
    salesOrders: {
      byStatus: salesOrdersByStatus.map((r) => ({ status: r.status, count: r._count._all })),
      total: Number(salesOrdersTotal._sum.total ?? 0),
    },
    purchaseOrders: {
      byStatus: purchaseOrdersByStatus.map((r) => ({ status: r.status, count: r._count._all })),
      total: Number(purchaseOrdersTotal._sum.total ?? 0),
    },
    production: {
      byStatus: productionByStatus.map((r) => ({
        status: r.status,
        count: r._count._all,
        totalActual: Number(r._sum.quantityActual ?? 0),
      })),
    },
    quality: {
      byResult: qualityByResult.map((r) => ({ result: r.result, count: r._count._all })),
    },
    inventoryValuation,
  };
}
