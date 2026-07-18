import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getPurchaseOrderById } from "@/modules/purchase-orders/queries";
import { PurchaseOrderStatusActions } from "@/modules/purchase-orders/components/purchase-order-status-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.PURCHASE_ORDERS_READ);
  const { id } = await params;
  const po = await getPurchaseOrderById(id);
  if (!po) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`PO-${String(po.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">{po.supplier.name}</p>
        </div>
        <Badge>{po.status}</Badge>
      </div>

      {can(session, PERMISSIONS.PURCHASE_ORDERS_WRITE) && (
        <PurchaseOrderStatusActions id={po.id} status={po.status} />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit cost</TableHead>
            <TableHead>Line total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {po.lines.map((line) => (
            <TableRow key={line.id}>
              <TableCell>{`${line.product.name} (${line.product.sku})`}</TableCell>
              <TableCell>{String(line.quantity)}</TableCell>
              <TableCell>{String(line.unitCost)}</TableCell>
              <TableCell>{String(line.lineTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{String(po.subtotal)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{String(po.total)}</span>
        </div>
      </div>

      {po.notes && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Notes</span>
          <p className="text-sm text-muted-foreground">{po.notes}</p>
        </div>
      )}
    </div>
  );
}
