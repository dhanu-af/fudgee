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

export function getProductOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, sku: true, name: true, costPrice: true },
    orderBy: { name: "asc" },
  });
}
