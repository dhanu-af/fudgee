import Link from "next/link";
import type { getCustomerOrderHistory } from "@/modules/customer-account/queries";
import { ReorderButton } from "@/modules/customer-account/components/reorder-button";
import { OrderPaymentChooser } from "@/components/storefront/order-payment-chooser";
import { PaymentProofForm } from "@/components/storefront/payment-proof-form";

type Orders = Awaited<ReturnType<typeof getCustomerOrderHistory>>;

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Order received",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

// Color-codes each status so a customer can tell "Confirmed" apart from
// "Order received" or "Cancelled" at a glance, instead of every status
// showing the same neutral pill regardless of where the order actually is.
const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-400/15 text-slate-500",
  CONFIRMED: "bg-emerald-600/15 text-emerald-600",
  PACKED: "bg-blue-600/15 text-blue-600",
  DISPATCHED: "bg-indigo-600/15 text-indigo-600",
  DELIVERED: "bg-[var(--sf-primary-soft)] text-[var(--sf-primary)]",
  FULFILLED: "bg-[var(--sf-primary-soft)] text-[var(--sf-primary)]",
  CANCELLED: "bg-red-600/15 text-red-600",
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
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_STYLE[order.status] ?? "bg-[var(--sf-primary-soft)] text-[var(--sf-primary)]"
                }`}
              >
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              <span className="text-sm font-semibold text-[var(--sf-fg)]">
                ${Number(order.total).toFixed(2)}
              </span>
              <ReorderButton
                lines={order.lines.map((line) => ({
                  productId: line.productId,
                  name: line.product.name,
                  // Prisma Decimal instances are class instances, not plain
                  // objects — passing them straight into a Client Component
                  // prop crashes RSC serialization ("Only plain objects...
                  // can be passed to Client Components"), which surfaces to
                  // the customer as a generic client-side exception. Convert
                  // to plain numbers here, same as every other Decimal field
                  // on this page (order.total, order.subtotal, etc.).
                  sellPrice: line.product.sellPrice !== null ? Number(line.product.sellPrice) : null,
                  imageUrl: line.product.imageUrl,
                  quantity: Number(line.quantity),
                }))}
              />
            </div>
          </div>

          {/* Shown regardless of status — same as the Operations sales-order
              page, which never gates its own "View / Print Invoice" button
              on fulfillment. getCustomerOrderById has no status filter
              either, so the page behind this link always works. */}
          <Link
            href={`/account/orders/${order.id}/invoice`}
            className="mt-2 inline-block text-sm font-semibold text-[var(--sf-primary)] hover:underline"
          >
            View / Print Invoice →
          </Link>

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

          <div className="mt-2 flex flex-col gap-1 text-sm">
            {order.discountAmount != null && Number(order.discountAmount) > 0 && (
              <div className="flex items-center justify-between text-[var(--sf-primary)]">
                <span>Discount{order.discountPercent ? ` (${order.discountPercent}% off)` : ""}</span>
                <span>−${Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[var(--sf-muted)]">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            {(order.deliveryFee !== null || order.deliveryFeeReason !== null) && (
              <div className="flex items-center justify-between text-[var(--sf-muted)]">
                <span>Delivery{order.deliveryFeeReason ? ` (${order.deliveryFeeReason})` : ""}</span>
                <span>
                  {order.deliveryFee !== null && Number(order.deliveryFee) > 0
                    ? `$${Number(order.deliveryFee).toFixed(2)}`
                    : "FREE"}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between font-semibold text-[var(--sf-fg)]">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {order.outOfDeliveryRange ? (
            <p className="mt-3 text-sm text-red-500">
              This address is outside our standard delivery area — we&apos;re confirming whether delivery is
              possible and what it will cost. You&apos;ll be able to pay once that&apos;s done.
            </p>
          ) : (
            order.paymentStatus !== "PAID" && (
              <div className="mt-3 rounded-xl bg-[var(--sf-bg)] p-4 ring-1 ring-[var(--sf-border)]">
                {order.paymentMethod === "CASH" || order.paymentMethod === "PAYID" ? (
                  <PaymentProofForm
                    orderId={order.id}
                    existingReference={order.paymentReferenceNumber}
                    existingReceiptUrl={order.paymentReceiptUrl}
                  />
                ) : (
                  <OrderPaymentChooser orderId={order.id} total={Number(order.total)} />
                )}
              </div>
            )
          )}

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
