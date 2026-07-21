"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dispatchShipment, type ShippingFormState } from "@/modules/shipping/actions";

type CarrierOption = { id: string; name: string };

export function DispatchForm({ shipmentId, carriers }: { shipmentId: string; carriers: CarrierOption[] }) {
  const [state, formAction, pending] = useActionState<ShippingFormState, FormData>(
    dispatchShipment.bind(null, shipmentId),
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border p-4">
      <h3 className="font-medium">Dispatch this shipment</h3>
      <p className="text-sm text-muted-foreground">
        This deducts stock from Inventory and marks the sales order Dispatched.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="carrierId">Carrier</Label>
          <Select name="carrierId" items={Object.fromEntries(carriers.map((c) => [c.id, c.name]))}>
            <SelectTrigger id="carrierId">
              <SelectValue placeholder="Select a carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="trackingNumber">Tracking number</Label>
          <Input id="trackingNumber" name="trackingNumber" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="freightCost">Freight cost</Label>
          <Input id="freightCost" name="freightCost" type="number" step="0.01" min="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="numberOfCartons">Number of cartons</Label>
          <Input id="numberOfCartons" name="numberOfCartons" type="number" min="1" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="driverName">Driver</Label>
          <Input id="driverName" name="driverName" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehicleInfo">Vehicle</Label>
          <Input id="vehicleInfo" name="vehicleInfo" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signedBy">Signed by</Label>
          <Input id="signedBy" name="signedBy" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dispatchNotes">Notes</Label>
        <Textarea id="dispatchNotes" name="dispatchNotes" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Dispatching..." : "Dispatch Shipment"}
      </Button>
    </form>
  );
}
