"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReturn, type ShippingFormState } from "@/modules/shipping/actions";

type CustomerOption = { id: string; name: string };
type ShipmentOption = { id: string; label: string };

export function ReturnForm({
  customers,
  shipments,
}: {
  customers: CustomerOption[];
  shipments: ShipmentOption[];
}) {
  const [state, formAction, pending] = useActionState<ShippingFormState, FormData>(createReturn, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customerId">Customer</Label>
        <Select name="customerId" items={Object.fromEntries(customers.map((c) => [c.id, c.name]))}>
          <SelectTrigger id="customerId">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="shipmentId">Shipment (optional)</Label>
        <Select name="shipmentId" items={Object.fromEntries(shipments.map((s) => [s.id, s.label]))}>
          <SelectTrigger id="shipmentId">
            <SelectValue placeholder="Not linked to a shipment" />
          </SelectTrigger>
          <SelectContent>
            {shipments.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" name="reason" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" name="quantity" type="number" min="1" step="1" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="inspectionNotes">Inspection notes (optional)</Label>
        <Textarea id="inspectionNotes" name="inspectionNotes" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="refundAmount">Refund amount (optional)</Label>
        <Input id="refundAmount" name="refundAmount" type="number" step="0.01" min="0" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/shipping/returns" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
