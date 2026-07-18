import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualitySummaryCard({
  passRate,
  passCount,
  failCount,
  pendingCount,
}: {
  passRate: number | null;
  passCount: number;
  failCount: number;
  pendingCount: number;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FlaskConical className="size-4" />
          Quality Control Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold leading-tight">{passRate !== null ? `${passRate}%` : "—"}</p>
        <p className="text-xs text-muted-foreground">
          pass rate · {passCount} pass, {failCount} fail, {pendingCount} pending
        </p>
        <Link href="/quality" className="mt-2 text-xs text-primary hover:underline">
          View quality control →
        </Link>
      </CardContent>
    </Card>
  );
}
