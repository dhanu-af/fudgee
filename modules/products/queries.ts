import { db } from "@/lib/db";

export function getProducts() {
  return db.product.findMany({ orderBy: { createdAt: "desc" } });
}

export function getProductById(id: string) {
  return db.product.findUnique({ where: { id } });
}
