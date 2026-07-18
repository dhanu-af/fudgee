import { db } from "@/lib/db";

export function getSalesOrders() {
  return db.salesOrder.findMany({ orderBy: { createdAt: "desc" }, include: { customer: true } });
}

export function getSalesOrderById(id: string) {
  return db.salesOrder.findUnique({
    where: { id },
    include: { customer: true, lines: { include: { product: true } } },
  });
}

export function getCustomerOptions() {
  return db.customer.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function getProductOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, sku: true, name: true, sellPrice: true },
    orderBy: { name: "asc" },
  });
}
