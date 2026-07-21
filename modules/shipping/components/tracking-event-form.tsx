"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTrackingEvent, type ShippingFormState } from "@/modules/shipping/actions";

const STATUS_OPTIONS = ["Collected", "In Transit", "Out for Delivery", "Delivered", "Returned"];

export function TrackingEventForm({ shipmentId }: { shipmentId: string }) {
  const [state, formAction, pending] = useActionState<ShippingFormState, FormData>(
    addTrackingEvent.bind(null, shipmentId),
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border p-4">
      <h3 className="font-medium">Add tracking update</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={STATUS_OPTIONS[0]} items={Object.fromEntries(STATUS_OPTIONS.map((s) => [s, s]))}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="e.g. Brisbane Facility" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Note</Label>
        <Input id="note" name="note" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Adding..." : "Add update"}
      </Button>
    </form>
  );
}
