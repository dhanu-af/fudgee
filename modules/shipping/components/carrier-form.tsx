"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ShippingFormState } from "@/modules/shipping/actions";

type Carrier = {
  id: string;
  name: string;
  contactPhone: string | null;
  contactEmail: string | null;
  isActive: boolean;
  notes: string | null;
};

export function CarrierForm({
  action,
  carrier,
}: {
  action: (prev: ShippingFormState, formData: FormData) => Promise<ShippingFormState>;
  carrier?: Carrier;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={carrier?.name} placeholder="e.g. Australia Post" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contactPhone">Contact phone</Label>
        <Input id="contactPhone" name="contactPhone" defaultValue={carrier?.contactPhone ?? ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={carrier?.contactEmail ?? ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={carrier?.notes ?? ""} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={carrier?.isActive ?? true} className="size-4" />
        Active (selectable when dispatching a shipment)
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/shipping/carriers" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
