"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createBatchCalculation,
  type BatchCalculationFormState,
} from "@/modules/batch-calculations/actions";

export function BatchCalculationForm({
  recipeId,
  defaultEnteredBy,
}: {
  recipeId: string;
  defaultEnteredBy?: string;
}) {
  const [state, formAction, pending] = useActionState<BatchCalculationFormState, FormData>(
    createBatchCalculation,
    {}
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="recipeId" value={recipeId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="requiredBatchSize">Required batch size</Label>
          <Input
            id="requiredBatchSize"
            name="requiredBatchSize"
            type="number"
            step="0.0001"
            min="0"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="batchNumber">Batch number</Label>
          <Input id="batchNumber" name="batchNumber" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="enteredBy">Entered by</Label>
          <Input id="enteredBy" name="enteredBy" defaultValue={defaultEnteredBy ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="checkedBy">Checked by</Label>
          <Input id="checkedBy" name="checkedBy" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="calculationDate">Calculation date</Label>
          <Input id="calculationDate" name="calculationDate" type="date" defaultValue={today} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tolerancePercent">Tolerance %</Label>
          <Input id="tolerancePercent" name="tolerancePercent" type="number" step="0.01" min="0" defaultValue="2" />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Calculating..." : "Calculate & save batch"}
        </Button>
        <Button type="button" variant="outline" render={<Link href={`/production/recipes/${recipeId}`} />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
