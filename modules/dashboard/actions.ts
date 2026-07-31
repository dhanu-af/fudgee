"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export type BatchLookupState = { error?: string };

// Accepts "BATCH-0042", "0042", or a bare "42" — same seq a batch is
// identified by everywhere else (see "BATCH-XXXX" in
// production-batch-columns.tsx). Only needs DASHBOARD_VIEW (same as the
// dashboard page itself) since it just looks up and redirects — the actual
// batch detail page enforces its own PRODUCTION_READ requirement.
export async function lookupProductionBatch(
  _prev: BatchLookupState,
  formData: FormData
): Promise<BatchLookupState> {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);

  const raw = String(formData.get("batchNumber") ?? "").trim();
  if (!raw) return { error: "Enter a batch number." };

  const match = raw.match(/(\d+)\s*$/);
  const seq = match ? parseInt(match[1], 10) : NaN;
  if (!Number.isFinite(seq)) {
    return { error: "Enter a valid batch number, e.g. BATCH-0042 or 42." };
  }

  const batch = await db.productionBatch.findFirst({ where: { seq } });
  if (!batch) {
    return { error: `No batch found matching "${raw}".` };
  }

  redirect(`/production/${batch.id}`);
}
