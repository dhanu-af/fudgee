"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type DeliveryZoneOption = { id: string; label: string | null; minKm: unknown; maxKm: unknown; fee: unknown };

type DeliverySuburbOverride = {
  id: string;
  suburb: string | null;
  postcode: string | null;
  zoneId: string;
  isActive: boolean;
};

export function DeliverySuburbOverrideForm({
  action,
  override,
  zones,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  override?: DeliverySuburbOverride;
  zones: DeliveryZoneOption[];
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        Pins a known suburb and/or postcode straight to a delivery zone, skipping the distance calculation entirely
        — use this where a straight-line distance would give the wrong zone. Fill in whichever of suburb/postcode
        you want to match on (either one alone is fine).
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="suburb">Suburb</Label>
          <Input id="suburb" name="suburb" placeholder="e.g. Ormeau" defaultValue={override?.suburb ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input id="postcode" name="postcode" placeholder="e.g. 4208" defaultValue={override?.postcode ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="zoneId">Assign to zone</Label>
        <select
          id="zoneId"
          name="zoneId"
          required
          defaultValue={override?.zoneId ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="" disabled>
            Choose a zone
          </option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.label ?? `${Number(z.minKm)}–${z.maxKm != null ? Number(z.maxKm) : "∞"} km`} — ${Number(z.fee).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={override?.isActive ?? true} className="size-4" />
        Active
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/delivery" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
