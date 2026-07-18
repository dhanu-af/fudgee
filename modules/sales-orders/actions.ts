"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { salesOrderSchema, salesOrderLineSchema } from "@/modules/sales-orders/schema";

export type SalesOrderFormState = { error?: string };

export async function createSalesOrder(
  _prev: SalesOrderFormState,
  formData: FormData
): Promise<SalesOrderFormState> {
  await requirePermission(PERMISSIONS.SALES_ORDERS_WRITE);

  const parsed = salesOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let rawLines: unknown;
  try {
    rawLines = JSON.parse(parsed.data.linesJson);
  } catch {
    return { error: "Invalid line items." };
  }
  const linesParsed = z.array(salesOrderLineSchema).min(1, "At least one line item is required").safeParse(rawLines);
  if (!linesParsed.success) {
    return { error: linesParsed.error.issues[0]?.message ?? "Invalid line items." };
  }

  const lines = linesParsed.data.map((l) => ({ ...l, lineTotal: l.quantity * l.unitPrice }));
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  await db.salesOrder.create({
    data: {
      customerId: parsed.data.customerId,
      requestedDate: parsed.data.requestedDate ? new Date(parsed.data.requestedDate) : undefined,
      notes: parsed.data.notes || undefined,
      subtotal,
      total: subtotal,
      lines: { create: lines },
    },
  });

  revalidatePath("/sales-orders");
  redirect("/sales-orders");
}

export type SalesOrderActionState = { error?: string };

export async function confirmSalesOrder(
  id: string,
  _prev: SalesOrderActionState,
  _formData: FormData
): Promise<SalesOrderActionState> {
  await requirePermission(PERMISSIONS.SALES_ORDERS_WRITE);
  await db.salesOrder.update({ where: { id }, data: { status: "CONFIRMED" } });
  revalidatePath(`/sales-orders/${id}`);
  return {};
}

// No hard stock-availability check for MVP — fulfillment can post an issue
// past zero stock; this is a known simplification, not an oversight.
export async function fulfillSalesOrder(
  id: string,
  _prev: SalesOrderActionState,
  _formData: FormData
): Promise<SalesOrderActionState> {
  const session = await requirePermission(PERMISSIONS.SALES_ORDERS_WRITE);

  const so = await db.salesOrder.findUnique({ where: { id }, include: { lines: true } });
  if (!so) return { error: "Sales order not found." };

  const location = await db.location.findFirst({ where: { isActive: true } });
  if (!location) {
    return { error: "Create a warehouse location before fulfilling sales orders." };
  }

  await db.$transaction([
    db.salesOrder.update({ where: { id }, data: { status: "FULFILLED" } }),
    ...so.lines.map((line) =>
      db.inventoryTransaction.create({
        data: {
          productId: line.productId,
          locationId: location.id,
          type: "ISSUE",
          quantity: -line.quantity,
          referenceType: "SalesOrder",
          referenceId: id,
          createdByUserId: session.user.id,
        },
      })
    ),
  ]);

  revalidatePath(`/sales-orders/${id}`);
  revalidatePath("/inventory");
  return {};
}

export async function cancelSalesOrder(
  id: string,
  _prev: SalesOrderActionState,
  _formData: FormData
): Promise<SalesOrderActionState> {
  await requirePermission(PERMISSIONS.SALES_ORDERS_WRITE);
  await db.salesOrder.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath(`/sales-orders/${id}`);
  return {};
}
