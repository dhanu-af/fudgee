"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  markPurchaseOrderSent,
  markPurchaseOrderReceived,
  cancelPurchaseOrder,
  type PurchaseOrderActionState,
} from "@/modules/purchase-orders/actions";

export function PurchaseOrderStatusActions({ id, status }: { id: string; status: string }) {
  const [sentState, sentAction, sentPending] = useActionState<PurchaseOrderActionState, FormData>(
    markPurchaseOrderSent.bind(null, id),
    {}
  );
  const [receivedState, receivedAction, receivedPending] = useActionState<PurchaseOrderActionState, FormData>(
    markPurchaseOrderReceived.bind(null, id),
    {}
  );
  const [cancelState, cancelAction, cancelPending] = useActionState<PurchaseOrderActionState, FormData>(
    cancelPurchaseOrder.bind(null, id),
    {}
  );

  const error = sentState.error || receivedState.error || cancelState.error;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {status === "DRAFT" && (
          <form action={sentAction}>
            <Button type="submit" disabled={sentPending}>
              {sentPending ? "Sending..." : "Mark as Sent"}
            </Button>
          </form>
        )}
        {(status === "DRAFT" || status === "SENT") && (
          <form action={receivedAction}>
            <Button type="submit" disabled={receivedPending}>
              {receivedPending ? "Receiving..." : "Mark as Received"}
            </Button>
          </form>
        )}
        {(status === "DRAFT" || status === "SENT") && (
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
