import { db } from "@/lib/db";

export function getProductionBatches() {
  return db.productionBatch.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
}

export function getProductionBatchById(id: string) {
  return db.productionBatch.findUnique({
    where: { id },
    include: {
      product: true,
      inputs: { include: { product: true } },
      qualityChecks: { orderBy: { createdAt: "desc" } },
    },
  });
}

export function getFinishedGoodOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: "FINISHED_GOOD" },
    select: { id: true, sku: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function getRawMaterialOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: { in: ["RAW_MATERIAL", "PACKAGING"] } },
    select: { id: true, sku: true, name: true },
    orderBy: { name: "asc" },
  });
}
