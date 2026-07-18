"use client";

import { useActionState } from "react";
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
import { createAdjustment, type AdjustmentFormState } from "@/modules/inventory/actions";

type Option = { id: string; label: string };

export function AdjustmentForm({ products, locations }: { products: Option[]; locations: Option[] }) {
  const [state, formAction, pending] = useActionState<AdjustmentFormState, FormData>(createAdjustment, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="productId">Product</Label>
        <Select
          name="productId"
          defaultValue={products[0]?.id}
          items={Object.fromEntries(products.map((p) => [p.id, p.label]))}
        >
          <SelectTrigger id="productId">
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="locationId">Location</Label>
        <Select
          name="locationId"
          defaultValue={locations[0]?.id}
          items={Object.fromEntries(locations.map((l) => [l.id, l.label]))}
        >
          <SelectTrigger id="locationId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="direction">Direction</Label>
          <Select name="direction" defaultValue="INCREASE" items={{ INCREASE: "Increase", DECREASE: "Decrease" }}>
            <SelectTrigger id="direction">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCREASE">Increase</SelectItem>
              <SelectItem value="DECREASE">Decrease</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" step="0.01" min="0" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" name="note" placeholder="Reason for this adjustment" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Record adjustment"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/inventory" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
