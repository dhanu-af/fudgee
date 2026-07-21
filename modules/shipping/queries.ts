import { db } from "@/lib/db";

// Confirmed orders with no shipment created yet — the Ready to Ship queue.
export function getReadyToShipOrders() {
  return db.salesOrder.findMany({
    where: { status: "CONFIRMED", shipment: null },
    include: { customer: true, lines: { include: { product: true } } },
    orderBy: { orderDate: "asc" },
  });
}

const shipmentListInclude = {
  salesOrder: { include: { customer: true } },
  carrier: true,
} as const;

export function getShipments() {
  return db.shipment.findMany({ include: shipmentListInclude, orderBy: { createdAt: "desc" } });
}

// The pick/pack queue — anything not yet dispatched.
export function getPickPackQueue() {
  return db.shipment.findMany({
    where: { status: { in: ["WAITING", "PICKING", "PACKING", "PACKED", "READY_TO_DISPATCH"] } },
    include: shipmentListInclude,
    orderBy: { createdAt: "asc" },
  });
}

// The dispatch queue — packed and waiting to physically leave.
export function getDispatchQueue() {
  return db.shipment.findMany({
    where: { status: "READY_TO_DISPATCH" },
    include: shipmentListInclude,
    orderBy: { createdAt: "asc" },
  });
}

export function getTrackingList() {
  return db.shipment.findMany({
    where: { status: { notIn: ["WAITING", "PICKING", "PACKING"] } },
    include: { ...shipmentListInclude, trackingEvents: { orderBy: { occurredAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });
}

export function getShipmentById(id: string) {
  return db.shipment.findUnique({
    where: { id },
    include: {
      salesOrder: { include: { customer: true } },
      carrier: true,
      dispatchedByUser: { select: { name: true } },
      items: { include: { salesOrderLine: { include: { product: true } } } },
      packages: { include: { items: { include: { product: true } } }, orderBy: { createdAt: "asc" } },
      trackingEvents: { orderBy: { occurredAt: "desc" } },
      returns: true,
    },
  });
}

export function getCarriers() {
  return db.carrier.findMany({ orderBy: { name: "asc" } });
}

export function getActiveCarrierOptions() {
  return db.carrier.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export function getCarrierById(id: string) {
  return db.carrier.findUnique({ where: { id } });
}

export function getReturns() {
  return db.return.findMany({
    include: { customer: true, shipment: { select: { seq: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getReturnById(id: string) {
  return db.return.findUnique({ where: { id }, include: { customer: true, shipment: true } });
}

export function getShipmentOptionsForReturns() {
  return db.shipment.findMany({
    select: { id: true, seq: true, salesOrder: { select: { customer: { select: { name: true } } } } },
    orderBy: { seq: "desc" },
  });
}

// --- Shipping Reports ---

export async function getShippingReportData() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    shipments,
    returns,
    shippedToday,
    freightAgg,
  ] = await Promise.all([
    db.shipment.findMany({
      include: { carrier: true, salesOrder: { select: { requestedDate: true } } },
    }),
    db.return.findMany(),
    db.shipment.count({ where: { dispatchedAt: { gte: startOfToday } } }),
    db.shipment.aggregate({ _sum: { freightCost: true } }),
  ]);

  const now = new Date();
  const delayed = shipments.filter(
    (s) =>
      s.status !== "DELIVERED" &&
      s.status !== "CANCELLED" &&
      s.salesOrder.requestedDate &&
      s.salesOrder.requestedDate < now
  ).length;

  const delivered = shipments.filter((s) => s.status === "DELIVERED" && s.dispatchedAt);
  const avgShippingHours =
    delivered.length > 0
      ? delivered.reduce((sum, s) => sum + (s.updatedAt.getTime() - s.dispatchedAt!.getTime()), 0) /
        delivered.length /
        (1000 * 60 * 60)
      : null;

  const carrierMap = new Map<string, { name: string; count: number; delivered: number }>();
  for (const s of shipments) {
    if (!s.carrier) continue;
    const entry = carrierMap.get(s.carrier.id) ?? { name: s.carrier.name, count: 0, delivered: 0 };
    entry.count += 1;
    if (s.status === "DELIVERED") entry.delivered += 1;
    carrierMap.set(s.carrier.id, entry);
  }

  const totalShipments = shipments.filter((s) => s.status !== "CANCELLED").length;
  const returnRate = totalShipments > 0 ? (returns.length / totalShipments) * 100 : 0;

  return {
    ordersShippedToday: shippedToday,
    ordersDelayed: delayed,
    totalFreightCost: Number(freightAgg._sum.freightCost ?? 0),
    deliveredCount: delivered.length,
    avgShippingHours,
    carrierPerformance: [...carrierMap.values()].sort((a, b) => b.count - a.count),
    returnRate,
    returnCount: returns.length,
  };
}
