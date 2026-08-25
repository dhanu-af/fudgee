"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAllStuckInventoryTransactions } from "@/modules/inventory/actions";

export function DeleteAllStuckButton() {
  const [state, formAction, pending] = useActionState(deleteAllStuckInventoryTransactions, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Delete every transaction whose source record (production batch, shipment, etc.) no longer exists? Entries still tied to a live record are never touched. This cannot be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Cleaning up..." : "Delete all stuck entries"}
      </Button>
      {state.message && <p className="mt-1 text-xs text-muted-foreground">{state.message}</p>}
      {state.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
