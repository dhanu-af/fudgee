import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BUCKET_ORDER = ["Current", "1-30", "31-60", "61-90", "90+"] as const;

export function ArAgingCard({
  buckets,
  totalOutstanding,
}: {
  buckets: Record<string, { count: number; amount: number }>;
  totalOutstanding: number;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Accounts Receivable Aging</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-2xl font-semibold">{totalOutstanding.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">total outstanding across unpaid/partially paid invoices</p>
        <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs">
          {BUCKET_ORDER.map((key) => (
            <div key={key} className="rounded-md border border-border/60 p-2">
              <p className="font-medium">{key}</p>
              <p>{buckets[key]?.amount.toFixed(2) ?? "0.00"}</p>
              <p className="text-muted-foreground">{buckets[key]?.count ?? 0} inv.</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
