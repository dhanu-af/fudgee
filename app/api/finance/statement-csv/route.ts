import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getStatement, resolveRange } from "@/modules/finance/queries";
import { withRunningBalance, toCsv } from "@/modules/finance/lib/statement";

export async function GET(request: Request) {
  await requirePermission(PERMISSIONS.FINANCE_READ);

  const { searchParams } = new URL(request.url);
  const range = resolveRange(searchParams.get("from") ?? undefined, searchParams.get("to") ?? undefined);
  const entries = await getStatement(range.from, range.to);
  const csv = toCsv(withRunningBalance(entries));

  const fromStr = range.from.toISOString().slice(0, 10);
  const toStr = range.to.toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="statement-${fromStr}-to-${toStr}.csv"`,
    },
  });
}
