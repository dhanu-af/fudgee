import { db } from "@/lib/db";

export function getSuppliers() {
  return db.supplier.findMany({ orderBy: { createdAt: "desc" } });
}

export function getSupplierById(id: string) {
  return db.supplier.findUnique({ where: { id } });
}

export function getActiveSupplierOptions() {
  return db.supplier.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}
