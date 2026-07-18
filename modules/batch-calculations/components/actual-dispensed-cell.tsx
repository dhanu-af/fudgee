"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateActualDispensed, type ActualDispensedState } from "@/modules/batch-calculations/actions";

export function ActualDispensedCell({
  lineId,
  recipeId,
  initialValue,
}: {
  lineId: string;
  recipeId: string;
  initialValue: number | null;
}) {
  const [state, formAction, pending] = useActionState<ActualDispensedState, FormData>(
    updateActualDispensed.bind(null, lineId, recipeId),
    {}
  );
  const [value, setValue] = useState(initialValue != null ? String(initialValue) : "");

  return (
    <form action={formAction} className="flex items-center gap-1">
      <Input
        name="actualDispensed"
        type="number"
        step="0.0001"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 w-24"
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "..." : "Save"}
      </Button>
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
    </form>
  );
}
