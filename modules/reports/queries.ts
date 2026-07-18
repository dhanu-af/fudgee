import { db } from "@/lib/db";
import { getStockLevels } from "@/modules/inventory/queries";
import { computeBatchCosting } from "@/modules/production/lib/batch-costing";

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
    completedBatches,
  ] = await Promise.all([
    db.salesOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    db.salesOrder.aggregate({ _sum: { total: true } }),
    db.purchaseOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    db.purchaseOrder.aggregate({ _sum: { total: true } }),
    db.productionBatch.groupBy({ by: ["status"], _count: { _all: true }, _sum: { quantityActual: true } }),
    db.qualityCheck.groupBy({ by: ["result"], _count: { _all: true } }),
    getStockLevels(),
    db.product.findMany({ select: { id: true, costPrice: true } }),
    db.productionBatch.findMany({
      where: { status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      include: { product: true, inputs: { include: { product: true } } },
    }),
  ]);

  const batchCosting = completedBatches.map((batch) => {
    const sellPrice = batch.product.sellPrice != null ? Number(batch.product.sellPrice) : null;
    const costing = computeBatchCosting(batch.inputs, Number(batch.quantityActual ?? 0), sellPrice);
    return {
      id: batch.id,
      seq: batch.seq,
      productName: batch.product.name,
      productSku: batch.product.sku,
      quantityActual: Number(batch.quantityActual ?? 0),
      quantityWaste: batch.quantityWaste != null ? Number(batch.quantityWaste) : 0,
      ...costing,
    };
  });

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
    batchCosting,
  };
}
