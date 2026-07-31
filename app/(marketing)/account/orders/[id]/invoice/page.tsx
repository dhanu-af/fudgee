import { notFound } from "next/navigation";
import Link from "next/link";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerOrderById } from "@/modules/customer-account/queries";
import { getStorefrontSettings } from "@/modules/storefront/queries";
import { PrintInvoiceButton } from "@/modules/sales-orders/components/print-invoice-button";

export const dynamic = "force-dynamic";

// A customer-facing mirror of the admin invoice page
// (app/(dashboard)/sales-orders/[id]/invoice) — same layout, but scoped to
// the signed-in customer's own order (see getCustomerOrderById) instead of
// requiring staff permissions, and uses the session customer directly
// rather than order.customer for Bill To/Ship To.
export default async function CustomerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const customer = await requireCustomer();
  const { id } = await params;
  const [order, settings] = await Promise.all([getCustomerOrderById(customer.id, id), getStorefrontSettings()]);
  if (!order) notFound();

  const invoiceNumber = `SO-${String(order.seq).padStart(4, "0")}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-12 sm:px-8">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/account" className="text-sm font-semibold text-[var(--sf-primary)] hover:underline">
          ← Back to My Account
        </Link>
        <PrintInvoiceButton />
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-[var(--sf-border)] bg-white p-8 text-sm text-neutral-900 print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-semibold">Fudgee</p>
            {settings?.contactAddress && (
              <p className="whitespace-pre-line text-neutral-500">{settings.contactAddress}</p>
            )}
            {settings?.contactPhone && <p className="text-neutral-500">{settings.contactPhone}</p>}
            {settings?.contactEmail && <p className="text-neutral-500">{settings.contactEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight text-[var(--sf-primary)]">INVOICE</p>
            <p className="mt-2 text-neutral-500">Invoice No. {invoiceNumber}</p>
            <p className="text-neutral-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="bg-[var(--sf-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--sf-primary-foreground)]">
              Bill To
            </div>
            <div className="mt-2 flex flex-col gap-0.5">
              <p className="font-medium">{customer.name}</p>
              {customer.billingAddress && (
                <p className="whitespace-pre-line text-neutral-500">{customer.billingAddress}</p>
              )}
              {customer.email && <p className="text-neutral-500">{customer.email}</p>}
              {customer.phone && <p className="text-neutral-500">{customer.phone}</p>}
            </div>
          </div>
          <div>
            <div className="bg-[var(--sf-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--sf-primary-foreground)]">
              Ship To
            </div>
            <div className="mt-2 flex flex-col gap-0.5">
              <p className="font-medium">{customer.name}</p>
              <p className="whitespace-pre-line text-neutral-500">
                {order.shippingAddress || customer.shippingAddress || customer.billingAddress || "—"}
              </p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[var(--sf-primary)] text-[var(--sf-primary-foreground)]">
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Qty</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Description</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Unit Price</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.id} className="border-b border-neutral-200">
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
            {order.discountAmount != null && Number(order.discountAmount) > 0 && (
              <>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Items total</span>
                  <span>{(Number(order.subtotal) + Number(order.discountAmount)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-[var(--sf-primary)]">
                  <span>Discount{order.discountPercent ? ` (${order.discountPercent}% off)` : ""}</span>
                  <span>−{Number(order.discountAmount).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Subtotal</span>
              <span>{Number(order.subtotal).toFixed(2)}</span>
            </div>
            {order.gstAmount != null && (
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">GST (incl.)</span>
                <span>{Number(order.gstAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-200 py-2 text-base font-semibold">
              <span>Total</span>
              <span>{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center">
          <p className="text-xl font-semibold italic">Thank you!</p>
          <p className="text-xs text-neutral-500">It has been a pleasure doing business with you.</p>
        </div>
      </div>
    </div>
  );
}
