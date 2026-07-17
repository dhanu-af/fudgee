import { db } from "@/lib/db";

export function getCustomers() {
  return db.customer.findMany({ orderBy: { createdAt: "desc" } });
}

export function getCustomerById(id: string) {
  return db.customer.findUnique({ where: { id } });
}
