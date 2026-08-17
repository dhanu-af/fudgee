"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type DeliveryZone = {
  id: string;
  minKm: unknown;
  maxKm: unknown;
  fee: unknown;
  label: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function DeliveryZoneForm({
  action,
  zone,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  zone?: DeliveryZone;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="minKm">From (km)</Label>
          <Input
            id="minKm"
            name="minKm"
            type="number"
            min={0}
            step="0.1"
            required
            defaultValue={zone?.minKm != null ? Number(zone.minKm) : 0}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="maxKm">Up to (km, optional)</Label>
          <Input
            id="maxKm"
            name="maxKm"
            type="number"
            min={0}
            step="0.1"
            defaultValue={zone?.maxKm != null ? Number(zone.maxKm) : ""}
            placeholder="Leave blank for no upper limit"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        A delivery address whose distance falls in this range (inclusive at both ends) is charged this fee. Leave
        &quot;Up to&quot; blank only on your furthest zone if you want it to cover any distance beyond it — otherwise
        the furthest zone with an upper limit set becomes the delivery radius, and anything beyond it is
        automatically treated as not deliverable.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fee">Delivery fee ($)</Label>
        <Input id="fee" name="fee" type="number" min={0} step="0.01" required defaultValue={zone?.fee != null ? Number(zone.fee) : ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Label (optional)</Label>
        <Input id="label" name="label" placeholder="e.g. Zone 1 (0–10 km)" defaultValue={zone?.label ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={zone?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={zone?.isActive ?? true} className="size-4" />
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
