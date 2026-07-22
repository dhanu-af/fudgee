import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Plain native GET-form (no client JS needed) — reused by Profit & Loss,
// Statement, and Customer Profitability, all of which read ?from=&to= as
// searchParams and default to the current month when absent.
export function FinanceRangeForm({
  action,
  from,
  to,
  extra,
}: {
  action: string;
  from: string;
  to: string;
  extra?: React.ReactNode;
}) {
  return (
    <form action={action} method="get" className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="from">From</Label>
        <input
          id="from"
          name="from"
          type="date"
          defaultValue={from}
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="to">To</Label>
        <input
          id="to"
          name="to"
          type="date"
          defaultValue={to}
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Button type="submit" variant="outline">
        Apply
      </Button>
      {extra}
    </form>
  );
}
