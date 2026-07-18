import { db } from "@/lib/db";

export function getLocations() {
  return db.location.findMany({ orderBy: { createdAt: "desc" } });
}

export function getLocationById(id: string) {
  return db.location.findUnique({ where: { id } });
}
