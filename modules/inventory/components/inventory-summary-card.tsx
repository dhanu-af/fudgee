import Link from "next/link";
import { Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InventorySummaryCard({
  skuLocationCount,
  totalUnitsOnHand,
}: {
  skuLocationCount: number;
  totalUnitsOnHand: number;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Boxes className="size-4" />
          Inventory Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold leading-tight">{totalUnitsOnHand}</p>
        <p className="text-xs text-muted-foreground">
          units on hand across {skuLocationCount} product/location{skuLocationCount === 1 ? "" : "s"}
        </p>
        <Link href="/inventory" className="mt-2 text-xs text-primary hover:underline">
          View inventory →
        </Link>
      </CardContent>
    </Card>
  );
}
