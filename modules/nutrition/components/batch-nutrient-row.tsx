"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { updateBatchNutritionField, type NutritionFormState } from "@/modules/nutrition/actions";

export function BatchNutrientRow({
  batchNutritionId,
  field,
  label,
  unit,
  per100g,
  perServing,
  editable,
}: {
  batchNutritionId: string;
  field: string;
  label: string;
  unit: string;
  per100g: number | null;
  perServing: number | null;
  editable: boolean;
}) {
  const [state, formAction, pending] = useActionState<NutritionFormState, FormData>(
    updateBatchNutritionField.bind(null, batchNutritionId),
    {}
  );

  if (!editable) {
    return (
      <TableRow>
        <TableCell>
          {label} ({unit})
        </TableCell>
        <TableCell>{per100g ?? "—"}</TableCell>
        <TableCell>{perServing ?? "—"}</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        {label} ({unit})
      </TableCell>
      <TableCell colSpan={2}>
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="field" value={field} />
          <Input
            name="value"
            type="number"
            step="0.001"
            defaultValue={per100g ?? ""}
            className="w-28"
            aria-label={`${label} per 100g`}
          />
          <Input name="reason" placeholder="Reason (optional)" className="w-48" />
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
          {perServing !== null && <span className="text-xs text-muted-foreground">per serving: {perServing}</span>}
        </form>
        {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
      </TableCell>
    </TableRow>
  );
}
