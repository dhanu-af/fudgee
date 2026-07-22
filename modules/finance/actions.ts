"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { expenseSchema, assetSchema, invoiceSchema, invoicePaymentSchema } from "@/modules/finance/schema";
import { sumPayments } from "@/modules/finance/lib/invoice-status";

export type FinanceFormState = { error?: string };

// --- Expenses ---

export async function createExpense(_prev: FinanceFormState, formData: FormData): Promise<FinanceFormState> {
  const session = await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = expenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.expense.create({
    data: {
      date: new Date(parsed.data.date),
      category: parsed.data.category,
      amount: parsed.data.amount,
      gstAmount: parsed.data.gstAmount,
      paymentMethod: parsed.data.paymentMethod,
      note: parsed.data.note,
      supplierId: parsed.data.supplierId,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/finance/expenses");
  revalidatePath("/finance");
  redirect("/finance/expenses");
}

export async function updateExpense(
  id: string,
  _prev: FinanceFormState,
  formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = expenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.expense.update({
    where: { id },
    data: {
      date: new Date(parsed.data.date),
      category: parsed.data.category,
      amount: parsed.data.amount,
      gstAmount: parsed.data.gstAmount ?? null,
      paymentMethod: parsed.data.paymentMethod,
      note: parsed.data.note ?? null,
      supplierId: parsed.data.supplierId ?? null,
    },
  });

  revalidatePath("/finance/expenses");
  revalidatePath("/finance");
  redirect("/finance/expenses");
}

export async function deleteExpense(
  id: string,
  _prev: FinanceFormState,
  _formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.expense.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete expense." };
  }

  revalidatePath("/finance/expenses");
  revalidatePath("/finance");
  return {};
}

// --- Assets ---

export async function createAsset(_prev: FinanceFormState, formData: FormData): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = assetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.asset.create({
    data: {
      name: parsed.data.name,
      category: parsed.data.category,
      purchaseDate: new Date(parsed.data.purchaseDate),
      purchaseCost: parsed.data.purchaseCost,
      salvageValue: parsed.data.salvageValue ?? 0,
      depreciationPeriodMonths: parsed.data.depreciationPeriodMonths,
      status: parsed.data.status,
      disposedAt: parsed.data.disposedAt ? new Date(parsed.data.disposedAt) : undefined,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/finance/assets");
  revalidatePath("/finance");
  redirect("/finance/assets");
}

export async function updateAsset(
  id: string,
  _prev: FinanceFormState,
  formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = assetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.asset.update({
    where: { id },
    data: {
      name: parsed.data.name,
      category: parsed.data.category,
      purchaseDate: new Date(parsed.data.purchaseDate),
      purchaseCost: parsed.data.purchaseCost,
      salvageValue: parsed.data.salvageValue ?? 0,
      depreciationPeriodMonths: parsed.data.depreciationPeriodMonths,
      status: parsed.data.status,
      disposedAt: parsed.data.disposedAt ? new Date(parsed.data.disposedAt) : null,
      notes: parsed.data.notes ?? null,
    },
  });

  revalidatePath("/finance/assets");
  revalidatePath(`/finance/assets/${id}`);
  revalidatePath("/finance");
  redirect("/finance/assets");
}

export async function deleteAsset(
  id: string,
  _prev: FinanceFormState,
  _formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.asset.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete asset." };
  }

  revalidatePath("/finance/assets");
  revalidatePath("/finance");
  return {};
}

// --- Invoices ---

export async function createInvoice(_prev: FinanceFormState, formData: FormData): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = invoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  let rawIds: unknown;
  try {
    rawIds = JSON.parse(parsed.data.salesOrderIdsJson);
  } catch {
    return { error: "Invalid sales order selection." };
  }
  const idsParsed = z.array(z.string()).min(1, "Select at least one sales order").safeParse(rawIds);
  if (!idsParsed.success) {
    return { error: idsParsed.error.issues[0]?.message ?? "Invalid sales order selection." };
  }

  // Re-verified server-side, not trusted from the client — same rule as
  // every other order-creation path in this app (checkout-actions.ts,
  // sales-orders/actions.ts). Only orders still uninvoiced for this exact
  // customer are eligible.
  const orders = await db.salesOrder.findMany({
    where: { id: { in: idsParsed.data }, customerId: parsed.data.customerId, invoiceLink: null },
  });
  if (orders.length === 0) {
    return { error: "None of the selected sales orders are eligible to be invoiced." };
  }

  // GST-inclusive total — this is the amount the customer actually owes,
  // distinct from the P&L's revenue figure (subtotal, GST excluded).
  const totalAmount = orders.reduce((sum, o) => sum + Number(o.total), 0);

  const invoice = await db.invoice.create({
    data: {
      customerId: parsed.data.customerId,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      notes: parsed.data.notes,
      totalAmount,
      salesOrders: { create: orders.map((o) => ({ salesOrderId: o.id, amount: Number(o.total) })) },
    },
  });

  revalidatePath("/finance/invoices");
  redirect(`/finance/invoices/${invoice.id}`);
}

export async function recordInvoicePayment(
  invoiceId: string,
  _prev: FinanceFormState,
  formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  const parsed = invoicePaymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true, salesOrders: true },
  });
  if (!invoice) return { error: "Invoice not found." };

  await db.invoicePayment.create({
    data: {
      invoiceId,
      date: new Date(parsed.data.date),
      amount: parsed.data.amount,
      method: parsed.data.method,
      reference: parsed.data.reference,
      note: parsed.data.note,
    },
  });

  // Only a full payment can flip the linked Sales Orders to PAID — a partial
  // payment on an invoice bundling several orders can't be attributed to any
  // one of them.
  const paidTotal = sumPayments(invoice.payments) + parsed.data.amount;
  if (paidTotal >= Number(invoice.totalAmount) && invoice.salesOrders.length > 0) {
    await db.salesOrder.updateMany({
      where: { id: { in: invoice.salesOrders.map((link) => link.salesOrderId) }, paymentStatus: { not: "PAID" } },
      data: { paymentStatus: "PAID", paidAt: new Date() },
    });
  }

  revalidatePath(`/finance/invoices/${invoiceId}`);
  revalidatePath("/finance/invoices");
  revalidatePath("/sales-orders");
  revalidatePath("/finance");
  return {};
}

// Blocked at the action level (not just relying on the FK) — silently
// cascade-deleting a payment history would be worse than a typical
// shipment/package delete.
export async function deleteInvoice(
  id: string,
  _prev: FinanceFormState,
  _formData: FormData
): Promise<FinanceFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  const invoice = await db.invoice.findUnique({ where: { id }, select: { payments: { select: { id: true } } } });
  if (invoice && invoice.payments.length > 0) {
    return { error: "Cannot delete an invoice that has recorded payments." };
  }

  try {
    await db.invoice.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete invoice." };
  }

  revalidatePath("/finance/invoices");
  return {};
}
