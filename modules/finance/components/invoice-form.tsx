"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice, type FinanceFormState } from "@/modules/finance/actions";

type OrderOption = { id: string; seq: number; total: unknown; orderDate: Date };

export function InvoiceForm({ customerId, orders }: { customerId: string; orders: OrderOption[] }) {
  const [state, formAction, pending] = useActionState<FinanceFormState, FormData>(createInvoice, {});
  const [selected, setSelected] = useState<string[]>(orders.map((o) => o.id));

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const total = orders.filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + Number(o.total), 0);

  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This customer has no confirmed, uninvoiced sales orders to bill.{" "}
        <Link href="/finance/invoices/new" className="underline">
          Choose a different customer
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="customerId" value={customerId} />
      <input type="hidden" name="salesOrderIdsJson" value={JSON.stringify(selected)} />

      <div className="flex flex-col gap-2">
        <Label>Sales orders to bill</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
          {orders.map((o) => (
            <label key={o.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(o.id)}
                  onChange={() => toggle(o.id)}
                  className="size-4"
                />
                {`SO-${String(o.seq).padStart(4, "0")}`} — {new Date(o.orderDate).toLocaleDateString()}
              </span>
              <span>{Number(o.total).toFixed(2)}</span>
            </label>
          ))}
        </div>
        <p className="text-right text-sm font-medium">Total: {total.toFixed(2)}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dueDate">Due date (optional)</Label>
        <Input id="dueDate" name="dueDate" type="date" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || selected.length === 0}>
          {pending ? "Creating..." : "Create invoice"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/finance/invoices" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
