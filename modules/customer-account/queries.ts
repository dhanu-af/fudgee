import { db } from "@/lib/db";

// Everything an "/account" page needs to render order history + shipping
// details in one round trip — products purchased per order (lines.product)
// and, if dispatched, the shipment/carrier/tracking timeline.
export function getCustomerOrderHistory(customerId: string) {
  return db.salesOrder.findMany({
    where: { customerId },
    orderBy: { orderDate: "desc" },
    include: {
      lines: { include: { product: true } },
      shipment: { include: { carrier: true, trackingEvents: { orderBy: { occurredAt: "desc" } } } },
    },
  });
}

// Single-order lookup for the customer-facing invoice page — scoped to
// customerId (not just the order id) so a signed-in customer can never view
// another customer's invoice by guessing/incrementing the URL.
export function getCustomerOrderById(customerId: string, orderId: string) {
  return db.salesOrder.findFirst({
    where: { id: orderId, customerId },
    include: { lines: { include: { product: true } } },
  });
}
