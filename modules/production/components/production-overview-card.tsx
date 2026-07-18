import Link from "next/link";
import { Factory } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionOverviewCard({
  activeBatchCount,
  completedBatchCount,
}: {
  activeBatchCount: number;
  completedBatchCount: number;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Factory className="size-4" />
          Production Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold leading-tight">{activeBatchCount}</p>
        <p className="text-xs text-muted-foreground">
          active batch{activeBatchCount === 1 ? "" : "es"} · {completedBatchCount} completed
        </p>
        <Link href="/production" className="mt-2 text-xs text-primary hover:underline">
          View production →
        </Link>
      </CardContent>
    </Card>
  );
}
