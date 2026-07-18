import { db } from "@/lib/db";

export function getOrganization() {
  return db.organization.findFirst();
}
