import type { getCustomerOrderHistory } from "@/modules/customer-account/queries";

type Orders = Awaited<ReturnType<typeof getCustomerOrderHistory>>;

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export function OrderHistory({ orders }: { orders: Orders }) {
  if (orders.length === 0) {
    return (
      <p className="rounded-2xl bg-[var(--sf-card)] p-6 text-sm text-[var(--sf-muted)] ring-1 ring-[var(--sf-border)]">
        You haven&apos;t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl bg-[var(--sf-card)] p-5 ring-1 ring-[var(--sf-border)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-semibold text-[var(--sf-fg)]">
                {`SO-${String(order.seq).padStart(4, "0")}`}
              </p>
              <p className="text-xs text-[var(--sf-muted)]">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--sf-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--sf-primary)]">
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              <span className="text-sm font-semibold text-[var(--sf-fg)]">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col divide-y divide-[var(--sf-border)]">
            {order.lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-[var(--sf-fg)]">
                  {line.product.name} × {String(line.quantity)}
                </span>
                <span className="text-[var(--sf-muted)]">${Number(line.lineTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-[var(--sf-bg)] p-4 ring-1 ring-[var(--sf-border)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-muted)]">Shipping</p>
            {order.shipment ? (
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[var(--sf-fg)]">
                    {order.shipment.status.replace(/_/g, " ")}
                  </span>
                  {order.shipment.carrier && (
                    <span className="text-[var(--sf-muted)]">via {order.shipment.carrier.name}</span>
                  )}
                  {order.shipment.trackingNumber && (
                    <span className="text-[var(--sf-muted)]">· Tracking #{order.shipment.trackingNumber}</span>
                  )}
                </div>
                {order.shipment.trackingEvents.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-1.5 border-l-2 border-[var(--sf-border)] pl-3">
                    {order.shipment.trackingEvents.map((event) => (
                      <li key={event.id} className="text-xs">
                        <span className="font-medium text-[var(--sf-fg)]">{event.status}</span>
                        {event.location && <span className="text-[var(--sf-muted)]"> — {event.location}</span>}
                        <span className="text-[var(--sf-muted)]">
                          {" "}
                          ({new Date(event.occurredAt).toLocaleDateString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--sf-muted)]">
                {order.status === "CANCELLED" ? "This order was cancelled." : "Not yet shipped."}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
