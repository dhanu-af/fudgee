import { db } from "@/lib/db";

export function getUsers() {
  return db.user.findMany({ include: { role: true }, orderBy: { createdAt: "desc" } });
}

export function getUserById(id: string) {
  return db.user.findUnique({ where: { id }, include: { role: true } });
}

export function getRoles() {
  return db.role.findMany({ orderBy: { name: "asc" } });
}
