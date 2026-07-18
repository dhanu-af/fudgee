"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  confirmSalesOrder,
  fulfillSalesOrder,
  cancelSalesOrder,
  type SalesOrderActionState,
} from "@/modules/sales-orders/actions";

export function SalesOrderStatusActions({ id, status }: { id: string; status: string }) {
  const [confirmState, confirmAction, confirmPending] = useActionState<SalesOrderActionState, FormData>(
    confirmSalesOrder.bind(null, id),
    {}
  );
  const [fulfillState, fulfillAction, fulfillPending] = useActionState<SalesOrderActionState, FormData>(
    fulfillSalesOrder.bind(null, id),
    {}
  );
  const [cancelState, cancelAction, cancelPending] = useActionState<SalesOrderActionState, FormData>(
    cancelSalesOrder.bind(null, id),
    {}
  );

  const error = confirmState.error || fulfillState.error || cancelState.error;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {status === "DRAFT" && (
          <form action={confirmAction}>
            <Button type="submit" disabled={confirmPending}>
              {confirmPending ? "Confirming..." : "Confirm order"}
            </Button>
          </form>
        )}
        {(status === "DRAFT" || status === "CONFIRMED") && (
          <form action={fulfillAction}>
            <Button type="submit" disabled={fulfillPending}>
              {fulfillPending ? "Fulfilling..." : "Mark as Fulfilled"}
            </Button>
          </form>
        )}
        {(status === "DRAFT" || status === "CONFIRMED") && (
          <form action={cancelAction}>
            <Button type="submit" variant="outline" disabled={cancelPending}>
              {cancelPending ? "Cancelling..." : "Cancel order"}
            </Button>
          </form>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
