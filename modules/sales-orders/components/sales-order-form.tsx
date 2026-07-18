"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSalesOrder, type SalesOrderFormState } from "@/modules/sales-orders/actions";

type Option = { id: string; label: string };
type ProductOption = Option & { sellPrice: number | null };
type Line = { productId: string; quantity: string; unitPrice: string };

export function SalesOrderForm({
  customers,
  products,
}: {
  customers: Option[];
  products: ProductOption[];
}) {
  const [state, formAction, pending] = useActionState<SalesOrderFormState, FormData>(createSalesOrder, {});
  const [lines, setLines] = useState<Line[]>([
    { productId: products[0]?.id ?? "", quantity: "1", unitPrice: String(products[0]?.sellPrice ?? 0) },
  ]);

  function addLine() {
    setLines((prev) => [
      ...prev,
      { productId: products[0]?.id ?? "", quantity: "1", unitPrice: String(products[0]?.sellPrice ?? 0) },
    ]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  const total = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);

  const linesForSubmit = lines
    .filter((l) => l.productId)
    .map((l) => ({
      productId: l.productId,
      quantity: Number(l.quantity) || 0,
      unitPrice: Number(l.unitPrice) || 0,
    }));

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="linesJson" value={JSON.stringify(linesForSubmit)} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerId">Customer</Label>
          <Select
            name="customerId"
            defaultValue={customers[0]?.id}
            items={Object.fromEntries(customers.map((c) => [c.id, c.label]))}
          >
            <SelectTrigger id="customerId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="requestedDate">Requested date</Label>
          <Input id="requestedDate" name="requestedDate" type="date" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Line items</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
          {lines.map((line, index) => (
            <div key={index} className="grid grid-cols-[1fr_100px_120px_auto] items-end gap-2">
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Product</span>}
                <Select
                  value={line.productId}
                  onValueChange={(value) => updateLine(index, { productId: value ?? "" })}
                  items={Object.fromEntries(products.map((p) => [p.id, p.label]))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Qty</span>}
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Unit price</span>}
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={lines.length === 1}
                onClick={() => removeLine(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLine} className="mt-2 w-fit">
            Add line
          </Button>
        </div>
        <p className="text-right text-sm font-medium">Total: {total.toFixed(2)}</p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create sales order"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/sales-orders" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
