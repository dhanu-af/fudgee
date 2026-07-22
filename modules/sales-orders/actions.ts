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

  const productIds = [...new Set(linesParsed.data.map((l) => l.productId))];
  const products = await db.product.findMany({ where: { id: { in: productIds } } });
  const costByProductId = new Map(products.map((p) => [p.id, p.costPrice !== null ? Number(p.costPrice) : null]));

  const lines = linesParsed.data.map((l) => ({
    ...l,
    lineTotal: l.quantity * l.unitPrice,
    // Snapshot for Finance's COGS/margin reporting — see the matching comment
    // in modules/storefront/checkout-actions.ts.
    unitCostAtSale: costByProductId.get(l.productId) ?? null,
  }));
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  if (parsed.data.orderNumber != null) {
    const existing = await db.salesOrder.findUnique({ where: { seq: parsed.data.orderNumber } });
    if (existing) {
      return { error: `SO-${String(parsed.data.orderNumber).padStart(4, "0")} is already used by another order.` };
    }
  }

  await db.salesOrder.create({
    data: {
      // Explicit only when manually overridden — omitting the field lets
      // Postgres's normal autoincrement assign the next number, same as ever.
      ...(parsed.data.orderNumber != null ? { seq: parsed.data.orderNumber } : {}),
      customerId: parsed.data.customerId,
      requestedDate: parsed.data.requestedDate ? new Date(parsed.data.requestedDate) : undefined,
      notes: parsed.data.notes || undefined,
      subtotal,
      total: subtotal,
      lines: { create: lines },
    },
  });

  // A manually-chosen number can be higher than Postgres's autoincrement
  // counter has ever seen — bump the counter forward so the next
  // auto-generated order number can never collide with (or fall behind) it.
  if (parsed.data.orderNumber != null) {
    await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"SalesOrder"', 'seq'), (SELECT COALESCE(MAX(seq), 0) FROM "SalesOrder"))`;
  }

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

export async function deleteSalesOrder(
  id: string,
  _prev: SalesOrderActionState,
  _formData: FormData
): Promise<SalesOrderActionState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.salesOrder.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete — this order may have a linked shipment or invoice. Delete those first." };
  }

  revalidatePath("/sales-orders");
  redirect("/sales-orders");
}
