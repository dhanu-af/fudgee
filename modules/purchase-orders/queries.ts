import { db } from "@/lib/db";

export function getPurchaseOrders() {
  return db.purchaseOrder.findMany({ orderBy: { createdAt: "desc" }, include: { supplier: true } });
}

export function getPurchaseOrderById(id: string) {
  return db.purchaseOrder.findUnique({
    where: { id },
    include: { supplier: true, lines: { include: { product: true } } },
  });
}

export function getSupplierOptions() {
  return db.supplier.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

// Purchase Orders only buy raw materials/packaging from suppliers — finished
// goods are made in-house via Production, never purchased.
export function getProductOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: { in: ["RAW_MATERIAL", "PACKAGING"] } },
    select: { id: true, sku: true, name: true, costPrice: true },
    orderBy: { name: "asc" },
  });
}
