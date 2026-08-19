"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setDeliveryFee, type SalesOrderActionState } from "@/modules/sales-orders/actions";

export function DeliveryFeeForm({ id, currentFee }: { id: string; currentFee: number | null }) {
  const [state, formAction, pending] = useActionState<SalesOrderActionState, FormData>(
    setDeliveryFee.bind(null, id),
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <label htmlFor="deliveryFee" className="text-sm font-medium">
        Delivery fee ($)
      </label>
      <p className="text-xs text-muted-foreground">
        Saving this updates the order total and clears the &quot;Over delivery range&quot; flag — the customer&apos;s
        confirmation page will show the new total and let them pay.
      </p>
      <div className="flex items-center gap-2">
        <Input
          id="deliveryFee"
          name="deliveryFee"
          type="number"
          min={0}
          step="0.01"
          defaultValue={currentFee ?? ""}
          placeholder="0.00"
          className="max-w-[140px]"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
