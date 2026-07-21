import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getShipmentById, getActiveCarrierOptions } from "@/modules/shipping/queries";
import { ShipmentStatusActions } from "@/modules/shipping/components/shipment-status-actions";
import { ShipmentStatusBadge } from "@/modules/shipping/components/shipment-status-badge";
import { PackageForm } from "@/modules/shipping/components/package-form";
import { PackageList } from "@/modules/shipping/components/package-list";
import { DispatchForm } from "@/modules/shipping/components/dispatch-form";
import { TrackingEventForm } from "@/modules/shipping/components/tracking-event-form";
import { TrackingTimeline } from "@/modules/shipping/components/tracking-timeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.SHIPPING_READ);
  const { id } = await params;
  const shipment = await getShipmentById(id);
  if (!shipment) notFound();

  const canWrite = can(session, PERMISSIONS.SHIPPING_WRITE);
  const carriers = canWrite ? await getActiveCarrierOptions() : [];

  const packedQuantityByProduct = new Map<string, number>();
  for (const pkg of shipment.packages) {
    for (const item of pkg.items) {
      packedQuantityByProduct.set(
        item.productId,
        (packedQuantityByProduct.get(item.productId) ?? 0) + Number(item.quantity)
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`SHIP-${String(shipment.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">
            <Link href={`/sales-orders/${shipment.salesOrder.id}`} className="hover:underline">
              {`SO-${String(shipment.salesOrder.seq).padStart(4, "0")}`}
            </Link>
            {" · "}
            {shipment.salesOrder.customer.name}
          </p>
        </div>
        <ShipmentStatusBadge status={shipment.status} />
      </div>

      {canWrite && (
        <ShipmentStatusActions id={shipment.id} status={shipment.status} stockReserved={shipment.stockReserved} />
      )}

      <div>
        <h2 className="mb-2 font-medium">Items to ship</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Packed so far</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipment.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.salesOrderLine.product.name} ({item.salesOrderLine.product.sku})
                </TableCell>
                <TableCell>{String(item.quantity)}</TableCell>
                <TableCell>{packedQuantityByProduct.get(item.salesOrderLine.productId) ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {shipment.deliveryAddress && (
        <div>
          <h2 className="mb-1 font-medium">Delivery address</h2>
          <p className="text-sm text-muted-foreground">{shipment.deliveryAddress}</p>
        </div>
      )}

      <div>
        <h2 className="mb-2 font-medium">Packages</h2>
        <PackageList packages={shipment.packages} canDelete={canWrite} />
        {canWrite && shipment.status !== "DISPATCHED" && (
          <div className="mt-3">
            <PackageForm
              shipmentId={shipment.id}
              items={shipment.items.map((item) => ({
                productId: item.salesOrderLine.productId,
                name: item.salesOrderLine.product.name,
                sku: item.salesOrderLine.product.sku,
              }))}
            />
          </div>
        )}
      </div>

      {canWrite && shipment.status === "READY_TO_DISPATCH" && (
        <DispatchForm shipmentId={shipment.id} carriers={carriers} />
      )}

      {shipment.status === "DISPATCHED" || ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "RETURNED"].includes(shipment.status) ? (
        <div className="rounded-lg border p-4 text-sm">
          <h2 className="mb-2 font-medium">Dispatch details</h2>
          <div className="grid gap-1 sm:grid-cols-2">
            {shipment.carrier && <div>Carrier: {shipment.carrier.name}</div>}
            {shipment.trackingNumber && <div>Tracking #: {shipment.trackingNumber}</div>}
            {shipment.freightCost && <div>Freight cost: {String(shipment.freightCost)}</div>}
            {shipment.driverName && <div>Driver: {shipment.driverName}</div>}
            {shipment.vehicleInfo && <div>Vehicle: {shipment.vehicleInfo}</div>}
            {shipment.numberOfCartons && <div>Cartons: {shipment.numberOfCartons}</div>}
            {shipment.signedBy && <div>Signed by: {shipment.signedBy}</div>}
            {shipment.dispatchedAt && <div>Dispatched: {new Date(shipment.dispatchedAt).toLocaleString()}</div>}
            {shipment.dispatchedByUser && <div>By: {shipment.dispatchedByUser.name}</div>}
          </div>
          {shipment.dispatchNotes && <p className="mt-2 text-muted-foreground">{shipment.dispatchNotes}</p>}
        </div>
      ) : null}

      <div>
        <h2 className="mb-2 font-medium">Tracking</h2>
        <TrackingTimeline events={shipment.trackingEvents} />
        {canWrite && shipment.status !== "WAITING" && shipment.status !== "PICKING" && shipment.status !== "PACKING" && (
          <div className="mt-3">
            <TrackingEventForm shipmentId={shipment.id} />
          </div>
        )}
      </div>
    </div>
  );
}
