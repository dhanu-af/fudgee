"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPackage, type ShippingFormState } from "@/modules/shipping/actions";

type ShipmentItemOption = { productId: string; name: string; sku: string };

export function PackageForm({ shipmentId, items }: { shipmentId: string; items: ShipmentItemOption[] }) {
  const [state, formAction, pending] = useActionState<ShippingFormState, FormData>(
    addPackage.bind(null, shipmentId),
    {}
  );
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const itemsJson = JSON.stringify(
    Object.entries(quantities)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([productId, qty]) => ({ productId, quantity: Number(qty) }))
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border p-4">
      <h3 className="font-medium">Add a box</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="boxType">Box type</Label>
          <Input id="boxType" name="boxType" placeholder="e.g. Small carton" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" name="weight" type="number" step="0.01" min="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lengthCm">Length (cm)</Label>
          <Input id="lengthCm" name="lengthCm" type="number" step="0.1" min="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="widthCm">Width (cm)</Label>
          <Input id="widthCm" name="widthCm" type="number" step="0.1" min="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heightCm">Height (cm)</Label>
          <Input id="heightCm" name="heightCm" type="number" step="0.1" min="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photoUrl">Photo URL (optional)</Label>
          <Input id="photoUrl" name="photoUrl" placeholder="https://..." />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>What&apos;s in this box?</Label>
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
            <span>
              {item.name} <span className="text-muted-foreground">({item.sku})</span>
            </span>
            <Input
              type="number"
              min="0"
              className="w-24"
              value={quantities[item.productId] ?? ""}
              onChange={(e) => setQuantities((q) => ({ ...q, [item.productId]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <input type="hidden" name="itemsJson" value={itemsJson} />

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Adding..." : "Add box"}
      </Button>
    </form>
  );
}
