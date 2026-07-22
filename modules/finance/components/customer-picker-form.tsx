import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Plain native GET-form navigation (?customerId=...) rather than the client
// Select component — this is a one-off "pick a customer, reload the page"
// step, no client state or server action needed.
export function CustomerPickerForm({ customers }: { customers: { id: string; name: string }[] }) {
  return (
    <form action="/finance/invoices/new" method="get" className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customerId">Customer</Label>
        <select
          id="customerId"
          name="customerId"
          required
          defaultValue=""
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-fit">
        Continue
      </Button>
    </form>
  );
}
