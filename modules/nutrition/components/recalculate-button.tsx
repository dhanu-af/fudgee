"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { recalculateBatchNutrition, type NutritionFormState } from "@/modules/nutrition/actions";

export function RecalculateButton({ batchNutritionId }: { batchNutritionId: string }) {
  const [state, formAction, pending] = useActionState<NutritionFormState, FormData>(
    recalculateBatchNutrition.bind(null, batchNutritionId),
    {}
  );

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Recalculating..." : "Recalculate from Recipe"}
      </Button>
      {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
