"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYMENT_METHODS } from "@/modules/finance/schema";
import { recordInvoicePayment, type FinanceFormState } from "@/modules/finance/actions";

export function InvoicePaymentForm({ invoiceId, remaining }: { invoiceId: string; remaining: number }) {
  const action = recordInvoicePayment.bind(null, invoiceId);
  const [state, formAction, pending] = useActionState<FinanceFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
      <p className="text-sm font-medium">Record a payment</p>
      <p className="text-xs text-muted-foreground">Remaining balance: {remaining.toFixed(2)}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required defaultValue={remaining > 0 ? remaining.toFixed(2) : undefined} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="method">Payment method</Label>
        <Select name="method" defaultValue="BANK_TRANSFER" items={Object.fromEntries(PAYMENT_METHODS.map((m) => [m, m.replace(/_/g, " ")]))}>
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="reference">Reference (optional)</Label>
        <Input id="reference" name="reference" placeholder="e.g. bank transaction ID" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Recording..." : "Record payment"}
      </Button>
    </form>
  );
}
