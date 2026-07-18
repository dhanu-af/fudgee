import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getSalesOrderById } from "@/modules/sales-orders/queries";
import { SalesOrderStatusActions } from "@/modules/sales-orders/components/sales-order-status-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.SALES_ORDERS_READ);
  const { id } = await params;
  const so = await getSalesOrderById(id);
  if (!so) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`SO-${String(so.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">{so.customer.name}</p>
        </div>
        <Badge>{so.status}</Badge>
      </div>

      {can(session, PERMISSIONS.SALES_ORDERS_WRITE) && (
        <SalesOrderStatusActions id={so.id} status={so.status} />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit price</TableHead>
            <TableHead>Line total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {so.lines.map((line) => (
            <TableRow key={line.id}>
              <TableCell>{`${line.product.name} (${line.product.sku})`}</TableCell>
              <TableCell>{String(line.quantity)}</TableCell>
              <TableCell>{String(line.unitPrice)}</TableCell>
              <TableCell>{String(line.lineTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{String(so.subtotal)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{String(so.total)}</span>
        </div>
      </div>

      {so.notes && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Notes</span>
          <p className="text-sm text-muted-foreground">{so.notes}</p>
        </div>
      )}
    </div>
  );
}
