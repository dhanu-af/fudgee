import { db } from "@/lib/db";

export function getQualityChecks() {
  return db.qualityCheck.findMany({
    orderBy: { createdAt: "desc" },
    include: { productionBatch: { include: { product: true } } },
  });
}

export function getCheckableBatchOptions() {
  return db.productionBatch.findMany({
    where: { status: { in: ["IN_PROGRESS", "COMPLETED"] } },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}
