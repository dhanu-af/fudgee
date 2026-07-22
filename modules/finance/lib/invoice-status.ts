// Invoice deliberately has no stored status column — Unpaid/Partially
// Paid/Paid must always be derived from actual payments so it can never
// drift from reality (matching Dhanu's other finance system exactly).

export type InvoiceStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export function sumPayments(payments: { amount: unknown }[]): number {
  return payments.reduce((sum, p) => sum + Number(p.amount), 0);
}

export function computeInvoiceStatus(totalAmount: number, paidTotal: number): InvoiceStatus {
  if (paidTotal <= 0) return "UNPAID";
  if (paidTotal < totalAmount) return "PARTIALLY_PAID";
  return "PAID";
}

export function arAgingBucket(dueDate: Date | null, today: Date): "Current" | "1-30" | "31-60" | "61-90" | "90+" {
  if (!dueDate) return "Current";
  const days = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Current";
  if (days <= 30) return "1-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
}
