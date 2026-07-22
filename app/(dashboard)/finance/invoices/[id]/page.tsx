import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getInvoiceById } from "@/modules/finance/queries";
import { deleteInvoice, deletePayment } from "@/modules/finance/actions";
import { InvoicePaymentForm } from "@/modules/finance/components/invoice-payment-form";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_VARIANT = { UNPAID: "destructive", PARTIALLY_PAID: "secondary", PAID: "default" } as const;
const STATUS_LABEL = { UNPAID: "Unpaid", PARTIALLY_PAID: "Partially Paid", PAID: "Paid" } as const;

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.FINANCE_READ);
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const canWrite = can(session, PERMISSIONS.FINANCE_WRITE);
  const canDelete = can(session, PERMISSIONS.SYSTEM_DELETE);
  const remaining = Number(invoice.totalAmount) - invoice.paidTotal;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`INV-${String(invoice.seq).padStart(4, "0")}`}</h1>
          <p className="text-sm text-muted-foreground">
            {invoice.customer.name} · Issued {new Date(invoice.issueDate).toLocaleDateString()}
            {invoice.dueDate && ` · Due ${new Date(invoice.dueDate).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
          {canDelete && (
            <DeleteRowButton
              action={deleteInvoice.bind(null, id)}
              confirmMessage={`Delete INV-${String(invoice.seq).padStart(4, "0")}? This cannot be undone.`}
            />
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-medium">Sales orders billed</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.salesOrders.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <Link href={`/sales-orders/${link.salesOrder.id}`} className="hover:underline">
                    {`SO-${String(link.salesOrder.seq).padStart(4, "0")}`}
                  </Link>
                </TableCell>
                <TableCell>{Number(link.amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-2 text-right text-sm font-medium">Total: {Number(invoice.totalAmount).toFixed(2)}</p>
      </div>

      {invoice.notes && (
        <div>
          <h2 className="mb-1 font-medium">Notes</h2>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}

      <div>
        <h2 className="mb-2 font-medium">Payments</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              {canDelete && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canDelete ? 5 : 4} className="h-16 text-center text-muted-foreground">
                  No payments recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              invoice.payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell>{Number(p.amount).toFixed(2)}</TableCell>
                  <TableCell>{p.method.replace(/_/g, " ")}</TableCell>
                  <TableCell>{p.reference ?? "—"}</TableCell>
                  {canDelete && (
                    <TableCell>
                      <DeleteRowButton
                        action={deletePayment.bind(null, p.id)}
                        confirmMessage="Delete this payment? If it was the payment that made this invoice/order Paid, that status will revert too."
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {canWrite && invoice.status !== "PAID" && <InvoicePaymentForm invoiceId={id} remaining={remaining} />}
    </div>
  );
}
