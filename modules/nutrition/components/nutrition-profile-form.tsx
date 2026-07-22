"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NUTRIENT_FIELDS, type OtherNutrient } from "@/modules/nutrition/lib/nutrients";
import { upsertNutritionProfile, type NutritionFormState } from "@/modules/nutrition/actions";

type NutritionProfile = {
  servingSizeGrams: unknown;
} & Partial<Record<(typeof NUTRIENT_FIELDS)[number]["key"], unknown>> & {
    otherNutrients: unknown;
  };

export function NutritionProfileForm({ productId, profile }: { productId: string; profile: NutritionProfile | null }) {
  const [state, formAction, pending] = useActionState<NutritionFormState, FormData>(
    upsertNutritionProfile.bind(null, productId),
    {}
  );
  const [otherNutrients, setOtherNutrients] = useState<OtherNutrient[]>(
    Array.isArray(profile?.otherNutrients) ? (profile!.otherNutrients as OtherNutrient[]) : []
  );

  const otherNutrientsJson = JSON.stringify(otherNutrients.filter((n) => n.name.trim() !== ""));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="servingSizeGrams">Serving size (g)</Label>
        <Input
          id="servingSizeGrams"
          name="servingSizeGrams"
          type="number"
          step="0.1"
          min="0"
          className="max-w-40"
          defaultValue={profile?.servingSizeGrams != null ? String(profile.servingSizeGrams) : ""}
        />
        <p className="text-xs text-muted-foreground">
          Used to calculate &quot;per serving&quot; values on production batches.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Per 100g</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NUTRIENT_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={field.key}>
                {field.label} ({field.unit})
              </Label>
              <Input
                id={field.key}
                name={field.key}
                type="number"
                step="0.001"
                min="0"
                defaultValue={profile?.[field.key] != null ? String(profile[field.key]) : ""}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Other nutrients (per 100g)</p>
        {otherNutrients.map((n, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Name (e.g. Vitamin C)"
              value={n.name}
              onChange={(e) =>
                setOtherNutrients((rows) => rows.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
              }
            />
            <Input
              placeholder="Value"
              type="number"
              step="0.001"
              className="w-28"
              value={n.value}
              onChange={(e) =>
                setOtherNutrients((rows) =>
                  rows.map((r, j) => (j === i ? { ...r, value: Number(e.target.value) } : r))
                )
              }
            />
            <Input
              placeholder="Unit"
              className="w-20"
              value={n.unit}
              onChange={(e) =>
                setOtherNutrients((rows) => rows.map((r, j) => (j === i ? { ...r, unit: e.target.value } : r)))
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setOtherNutrients((rows) => rows.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="self-start"
          onClick={() => setOtherNutrients((rows) => [...rows, { name: "", value: 0, unit: "mg" }])}
        >
          Add nutrient
        </Button>
      </div>

      <input type="hidden" name="otherNutrientsJson" value={otherNutrientsJson} />

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : "Save nutrition profile"}
      </Button>
    </form>
  );
}
