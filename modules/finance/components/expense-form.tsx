"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/modules/finance/schema";
import type { FinanceFormState } from "@/modules/finance/actions";

type SupplierOption = { id: string; name: string };

type Expense = {
  date: Date;
  category: string;
  amount: unknown;
  gstAmount: unknown;
  paymentMethod: string;
  note: string | null;
  supplierId: string | null;
};

export function ExpenseForm({
  action,
  suppliers,
  expense,
}: {
  action: (prev: FinanceFormState, formData: FormData) => Promise<FinanceFormState>;
  suppliers: SupplierOption[];
  expense?: Expense;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  // Defaulting to today (rather than leaving this blank for new expenses)
  // matters more than it looks: it's a required native date input, so an
  // empty value silently blocks form submission client-side with no visible
  // error — the request never even reaches the server.
  const dateValue = expense ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required defaultValue={dateValue} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={expense ? Number(expense.amount) : undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={expense?.category ?? "OTHER"} items={Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, c.replace(/_/g, " ")]))}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Capital Asset Purchase is excluded from Profit &amp; Loss operating expenses — that spend is recognized via
          Depreciation instead. Use it only to keep the Statement&apos;s cash view accurate.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paymentMethod">Payment method</Label>
        <Select name="paymentMethod" defaultValue={expense?.paymentMethod ?? "BANK_TRANSFER"} items={Object.fromEntries(PAYMENT_METHODS.map((m) => [m, m.replace(/_/g, " ")]))}>
          <SelectTrigger id="paymentMethod">
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="supplierId">Supplier (optional)</Label>
        <Select name="supplierId" defaultValue={expense?.supplierId ?? undefined} items={Object.fromEntries(suppliers.map((s) => [s.id, s.name]))}>
          <SelectTrigger id="supplierId">
            <SelectValue placeholder="Not linked to a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gstAmount">GST amount (optional)</Label>
        <Input
          id="gstAmount"
          name="gstAmount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={expense?.gstAmount != null ? Number(expense.gstAmount) : undefined}
        />
        <p className="text-xs text-muted-foreground">Used for the GST Summary report only — leave blank if untracked.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea id="note" name="note" defaultValue={expense?.note ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/finance/expenses" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
