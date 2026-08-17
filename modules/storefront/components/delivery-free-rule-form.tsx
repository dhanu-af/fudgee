"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type DeliveryFreeRule = {
  id: string;
  minOrderValue: unknown;
  maxKm: unknown;
  label: string;
  priority: number;
  isActive: boolean;
};

export function DeliveryFreeRuleForm({
  action,
  rule,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  rule?: DeliveryFreeRule;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="minOrderValue">Order value at or above ($)</Label>
          <Input
            id="minOrderValue"
            name="minOrderValue"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={rule?.minOrderValue != null ? Number(rule.minOrderValue) : ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="maxKm">Within distance (km)</Label>
          <Input
            id="maxKm"
            name="maxKm"
            type="number"
            min={0}
            step="0.1"
            required
            defaultValue={rule?.maxKm != null ? Number(rule.maxKm) : ""}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Orders whose subtotal is at or above this amount AND whose delivery distance is within this many km get free
        delivery outright — no delivery fee charged. Checked before the Delivery Zones table, in priority order below
        (lowest number first); the first matching rule wins.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Customer-facing reason</Label>
        <Input
          id="label"
          name="label"
          required
          placeholder="e.g. Free delivery – orders over $100 within 40 km."
          defaultValue={rule?.label ?? ""}
        />
        <p className="text-xs text-muted-foreground">Shown to the customer at checkout when this rule applies.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="priority">Priority (checked lowest-first)</Label>
        <Input id="priority" name="priority" type="number" defaultValue={rule?.priority ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={rule?.isActive ?? true} className="size-4" />
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
