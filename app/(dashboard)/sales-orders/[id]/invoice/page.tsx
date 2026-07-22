import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSalesOrderById } from "@/modules/sales-orders/queries";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { PrintInvoiceButton } from "@/modules/sales-orders/components/print-invoice-button";
import { Button } from "@/components/ui/button";

// Sidebar/Topbar are already print:hidden at the (dashboard) layout level —
// this page only needs to hide its own on-page controls when printing.
export default async function SalesOrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.SALES_ORDERS_READ);
  const { id } = await params;
  const [order, settings] = await Promise.all([getSalesOrderById(id), getStorefrontSettings()]);
  if (!order) notFound();

  const invoiceNumber = `SO-${String(order.seq).padStart(4, "0")}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" render={<Link href={`/sales-orders/${id}`} />}>
          Back to order
        </Button>
        <PrintInvoiceButton />
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-border/60 bg-background p-8 text-sm print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-semibold">Fudgee</p>
            {settings?.contactAddress && (
              <p className="whitespace-pre-line text-muted-foreground">{settings.contactAddress}</p>
            )}
            {settings?.contactPhone && <p className="text-muted-foreground">{settings.contactPhone}</p>}
            {settings?.contactEmail && <p className="text-muted-foreground">{settings.contactEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight text-primary">INVOICE</p>
            <p className="mt-2 text-muted-foreground">Invoice No. {invoiceNumber}</p>
            <p className="text-muted-foreground">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              Bill To
            </div>
            <div className="mt-2 flex flex-col gap-0.5">
              <p className="font-medium">{order.customer.name}</p>
              {order.customer.billingAddress && (
                <p className="whitespace-pre-line text-muted-foreground">{order.customer.billingAddress}</p>
              )}
              {order.customer.email && <p className="text-muted-foreground">{order.customer.email}</p>}
              {order.customer.phone && <p className="text-muted-foreground">{order.customer.phone}</p>}
            </div>
          </div>
          <div>
            <div className="bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              Ship To
            </div>
            <div className="mt-2 flex flex-col gap-0.5">
              <p className="font-medium">{order.customer.name}</p>
              <p className="whitespace-pre-line text-muted-foreground">
                {order.customer.shippingAddress || order.customer.billingAddress || "—"}
              </p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Qty</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Description</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Unit Cost</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.id} className="border-b border-border/60">
                <td className="px-3 py-2">{String(line.quantity)}</td>
                <td className="px-3 py-2">
                  {line.product.name} ({line.product.sku})
                </td>
                <td className="px-3 py-2">{Number(line.unitPrice).toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{Number(line.lineTotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="flex w-56 flex-col gap-1">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{Number(order.subtotal).toFixed(2)}</span>
            </div>
            {order.gstAmount != null && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">GST (incl.)</span>
                <span>{Number(order.gstAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border/60 py-2 text-base font-semibold">
              <span>Total</span>
              <span>{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-center">
          <p className="text-xl font-semibold italic">Thank you!</p>
          <p className="text-xs text-muted-foreground">It has been a pleasure doing business with you.</p>
        </div>
      </div>
    </div>
  );
}
