"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { setShipmentStatus, reserveStock, type ShippingFormState } from "@/modules/shipping/actions";

const NEXT_STATUS: Record<string, { label: string; next: "PICKING" | "PACKING" | "PACKED" | "READY_TO_DISPATCH" } | undefined> = {
  WAITING: { label: "Start Picking", next: "PICKING" },
  PICKING: { label: "Start Packing", next: "PACKING" },
  PACKING: { label: "Mark Packed", next: "PACKED" },
  PACKED: { label: "Ready to Dispatch", next: "READY_TO_DISPATCH" },
};

export function ShipmentStatusActions({
  id,
  status,
  stockReserved,
}: {
  id: string;
  status: string;
  stockReserved: boolean;
}) {
  const advance = NEXT_STATUS[status];
  const [advanceState, advanceAction, advancePending] = useActionState<ShippingFormState, FormData>(
    advance ? setShipmentStatus.bind(null, id, advance.next) : (async () => ({})),
    {}
  );
  const [reserveState, reserveAction, reservePending] = useActionState<ShippingFormState, FormData>(
    reserveStock.bind(null, id),
    {}
  );

  const showReserve = !stockReserved && !["DISPATCHED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].includes(status);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {showReserve && (
          <form action={reserveAction}>
            <Button type="submit" variant="outline" disabled={reservePending}>
              {reservePending ? "Reserving..." : "Reserve Stock"}
            </Button>
          </form>
        )}
        {advance && (
          <form action={advanceAction}>
            <Button type="submit" disabled={advancePending}>
              {advancePending ? "Updating..." : advance.label}
            </Button>
          </form>
        )}
      </div>
      {(advanceState.error || reserveState.error) && (
        <p className="text-sm text-destructive">{advanceState.error || reserveState.error}</p>
      )}
    </div>
  );
}
