"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  startProductionBatch,
  completeProductionBatch,
  cancelProductionBatch,
  type ProductionBatchActionState,
} from "@/modules/production/actions";

export function ProductionBatchStatusActions({
  id,
  status,
  quantityPlanned,
}: {
  id: string;
  status: string;
  quantityPlanned: number;
}) {
  const [startState, startAction, startPending] = useActionState<ProductionBatchActionState, FormData>(
    startProductionBatch.bind(null, id),
    {}
  );
  const [completeState, completeAction, completePending] = useActionState<ProductionBatchActionState, FormData>(
    completeProductionBatch.bind(null, id),
    {}
  );
  const [cancelState, cancelAction, cancelPending] = useActionState<ProductionBatchActionState, FormData>(
    cancelProductionBatch.bind(null, id),
    {}
  );

  const error = startState.error || completeState.error || cancelState.error;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        {status === "PLANNED" && (
          <form action={startAction}>
            <Button type="submit" disabled={startPending}>
              {startPending ? "Starting..." : "Start batch"}
            </Button>
          </form>
        )}
        {(status === "PLANNED" || status === "IN_PROGRESS") && (
          <form action={completeAction} className="flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="quantityActual" className="text-xs text-muted-foreground">
                Good quantity produced
              </Label>
              <Input
                id="quantityActual"
                name="quantityActual"
                type="number"
                step="0.01"
                min="0"
                defaultValue={quantityPlanned}
                className="w-32"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="quantityWaste" className="text-xs text-muted-foreground">
                Waste / rejects
              </Label>
              <Input
                id="quantityWaste"
                name="quantityWaste"
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                className="w-32"
              />
            </div>
            <Button type="submit" disabled={completePending}>
              {completePending ? "Completing..." : "Complete batch"}
            </Button>
          </form>
        )}
        {(status === "PLANNED" || status === "IN_PROGRESS") && (
          <form action={cancelAction}>
            <Button type="submit" variant="outline" disabled={cancelPending}>
              {cancelPending ? "Cancelling..." : "Cancel batch"}
            </Button>
          </form>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
