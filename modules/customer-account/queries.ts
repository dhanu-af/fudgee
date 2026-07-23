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
