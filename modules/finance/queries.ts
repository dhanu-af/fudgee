import { db } from "@/lib/db";
import { computeProfitAndLoss, computeCustomerProfitability, type SalesOrderForPnl } from "@/modules/finance/lib/pnl";
import { monthlyDepreciation, depreciationForRange, bookValue, isFullyDepreciated } from "@/modules/finance/lib/depreciation";
import { sumPayments, computeInvoiceStatus, arAgingBucket } from "@/modules/finance/lib/invoice-status";
import type { StatementEntry } from "@/modules/finance/lib/statement";

// Orders count as revenue-recognized once confirmed — matches how the rest
// of the app already treats CONFIRMED+ as real (inventory/shipping flow off
// it too), rather than introducing a second, Finance-only notion of "real."
const REVENUE_RECOGNIZED_STATUSES = ["CONFIRMED", "PACKED", "DISPATCHED", "DELIVERED", "FULFILLED"] as const;

export function resolveRange(from?: string, to?: string): { from: Date; to: Date } {
  const now = new Date();
  const start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = to ? new Date(to) : now;
  end.setHours(23, 59, 59, 999);
  return { from: start, to: end };
}

// --- Expenses ---

export function getExpenses() {
  return db.expense.findMany({ include: { supplier: true }, orderBy: { date: "desc" } });
}

export function getExpenseById(id: string) {
  return db.expense.findUnique({ where: { id }, include: { supplier: true } });
}

// --- Assets ---

export function getAssets() {
  return db.asset.findMany({ orderBy: { purchaseDate: "desc" } });
}

export function getAssetById(id: string) {
  return db.asset.findUnique({ where: { id } });
}

function toAssetLike(a: { purchaseDate: Date; purchaseCost: unknown; salvageValue: unknown; depreciationPeriodMonths: number }) {
  return {
    purchaseDate: a.purchaseDate,
    purchaseCost: Number(a.purchaseCost),
    salvageValue: Number(a.salvageValue),
    depreciationPeriodMonths: a.depreciationPeriodMonths,
  };
}

export async function getAssetsWithBookValue(asOf: Date = new Date()) {
  const assets = await getAssets();
  return assets.map((a) => {
    const like = toAssetLike(a);
    return {
      ...a,
      monthlyDepreciation: monthlyDepreciation(like),
      bookValue: bookValue(like, asOf),
      isFullyDepreciated: isFullyDepreciated(like, asOf),
    };
  });
}

export async function getAssetWithScheduleById(id: string, asOf: Date = new Date()) {
  const asset = await getAssetById(id);
  if (!asset) return null;
  const like = toAssetLike(asset);
  return {
    ...asset,
    monthlyDepreciation: monthlyDepreciation(like),
    bookValue: bookValue(like, asOf),
    isFullyDepreciated: isFullyDepreciated(like, asOf),
  };
}

// --- Invoices ---

const invoiceListInclude = {
  customer: true,
  payments: true,
  salesOrders: true,
} as const;

export async function getInvoices() {
  const invoices = await db.invoice.findMany({ include: invoiceListInclude, orderBy: { issueDate: "desc" } });
  return invoices.map((inv) => {
    const paidTotal = sumPayments(inv.payments);
    return { ...inv, paidTotal, status: computeInvoiceStatus(Number(inv.totalAmount), paidTotal) };
  });
}

export async function getInvoiceById(id: string) {
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      payments: { orderBy: { date: "desc" } },
      salesOrders: { include: { salesOrder: { include: { lines: { include: { product: true } } } } } },
    },
  });
  if (!invoice) return null;
  const paidTotal = sumPayments(invoice.payments);
  return { ...invoice, paidTotal, status: computeInvoiceStatus(Number(invoice.totalAmount), paidTotal) };
}

// Sales orders eligible to be picked into a new invoice for this customer —
// revenue-recognized and not already linked to another invoice.
export function getUninvoicedSalesOrders(customerId: string) {
  return db.salesOrder.findMany({
    where: {
      customerId,
      status: { in: [...REVENUE_RECOGNIZED_STATUSES] },
      invoiceLink: null,
    },
    orderBy: { orderDate: "asc" },
  });
}

// --- AR Aging ---

export async function getArAging() {
  const invoices = await getInvoices();
  const today = new Date();
  const outstanding = invoices.filter((inv) => inv.status !== "PAID");

  const buckets: Record<string, { count: number; amount: number }> = {
    Current: { count: 0, amount: 0 },
    "1-30": { count: 0, amount: 0 },
    "31-60": { count: 0, amount: 0 },
    "61-90": { count: 0, amount: 0 },
    "90+": { count: 0, amount: 0 },
  };

  for (const inv of outstanding) {
    const outstandingAmount = Number(inv.totalAmount) - inv.paidTotal;
    const bucket = arAgingBucket(inv.dueDate, today);
    buckets[bucket].count += 1;
    buckets[bucket].amount += outstandingAmount;
  }

  const totalOutstanding = outstanding.reduce((sum, inv) => sum + (Number(inv.totalAmount) - inv.paidTotal), 0);

  return { buckets, totalOutstanding, outstandingInvoiceCount: outstanding.length };
}

// --- Profit & Loss / Customer Profitability ---

const pnlOrderInclude = {
  lines: { select: { quantity: true, unitCostAtSale: true } },
} as const;

async function getExpenseAndFreightTotals(from: Date, to: Date) {
  const [expenseAgg, freightAgg] = await Promise.all([
    db.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: from, lte: to }, category: { not: "CAPITAL_ASSET_PURCHASE" } },
    }),
    db.shipment.aggregate({
      _sum: { freightCost: true },
      where: { dispatchedAt: { gte: from, lte: to } },
    }),
  ]);
  return {
    expenseTotal: Number(expenseAgg._sum.amount ?? 0),
    freightTotal: Number(freightAgg._sum.freightCost ?? 0),
  };
}

async function getDepreciationTotal(from: Date, to: Date) {
  const assets = await getAssets();
  return assets.reduce((sum, a) => sum + depreciationForRange(toAssetLike(a), from, to), 0);
}

// Whether any revenue-recognized line in range still has no cost snapshot —
// drives the P&L page's "some numbers may be understated" warning banner.
export async function hasAnyNullCostLine(from: Date, to: Date) {
  const count = await db.salesOrderLine.count({
    where: {
      unitCostAtSale: null,
      salesOrder: { status: { in: [...REVENUE_RECOGNIZED_STATUSES] }, orderDate: { gte: from, lte: to } },
    },
  });
  return count > 0;
}

export async function getProfitAndLoss(from: Date, to: Date) {
  const [orders, { expenseTotal, freightTotal }, depreciationTotal] = await Promise.all([
    db.salesOrder.findMany({
      where: { status: { in: [...REVENUE_RECOGNIZED_STATUSES] }, orderDate: { gte: from, lte: to } },
      include: pnlOrderInclude,
    }),
    getExpenseAndFreightTotals(from, to),
    getDepreciationTotal(from, to),
  ]);

  const ordersForPnl: SalesOrderForPnl[] = orders.map((o) => ({ subtotal: o.subtotal, lines: o.lines }));

  return computeProfitAndLoss({ orders: ordersForPnl, expenseTotal, freightTotal, depreciationTotal });
}

export async function getCustomerProfitability(from: Date, to: Date) {
  const orders = await db.salesOrder.findMany({
    where: { status: { in: [...REVENUE_RECOGNIZED_STATUSES] }, orderDate: { gte: from, lte: to } },
    include: { customer: { select: { id: true, name: true } }, ...pnlOrderInclude },
  });

  return computeCustomerProfitability(
    orders.map((o) => ({ customerId: o.customer.id, customerName: o.customer.name, subtotal: o.subtotal, lines: o.lines }))
  );
}

// --- Statement (unified ledger) ---

export async function getStatement(from: Date, to: Date): Promise<StatementEntry[]> {
  const [expenses, purchaseOrders, shipments, payments, stripeOrders, assets] = await Promise.all([
    db.expense.findMany({ where: { date: { gte: from, lte: to } }, include: { supplier: true } }),
    // Recognized on RECEIVED (goods actually arrived, real spend), dated by
    // orderDate since Purchase Orders don't track a separate received/paid
    // date. This is real cash out for raw materials — distinct from, and not
    // double-counted against, the P&L's COGS (which is driven by
    // SalesOrderLine.unitCostAtSale, a standard per-unit cost independent of
    // what any specific purchase order actually paid).
    db.purchaseOrder.findMany({
      where: { status: "RECEIVED", orderDate: { gte: from, lte: to } },
      include: { supplier: true },
    }),
    db.shipment.findMany({
      where: { dispatchedAt: { gte: from, lte: to }, freightCost: { not: null } },
      include: { salesOrder: { select: { seq: true } } },
    }),
    db.invoicePayment.findMany({
      where: { date: { gte: from, lte: to } },
      include: { invoice: { include: { customer: true } } },
    }),
    db.salesOrder.findMany({
      where: { paymentStatus: "PAID", stripePaymentIntentId: { not: null }, paidAt: { gte: from, lte: to } },
      include: { customer: true },
    }),
    getAssets(),
  ]);

  const entries: StatementEntry[] = [];

  for (const e of expenses) {
    entries.push({
      date: e.date,
      type: "EXPENSE",
      reference: `EXP-${String(e.seq).padStart(4, "0")}`,
      description: `${e.category.replace(/_/g, " ")}${e.supplier ? ` — ${e.supplier.name}` : ""}${e.note ? ` (${e.note})` : ""}`,
      debit: Number(e.amount),
      credit: 0,
      isCash: true,
    });
  }

  for (const po of purchaseOrders) {
    entries.push({
      date: po.orderDate,
      type: "PURCHASE",
      reference: `PO-${String(po.seq).padStart(4, "0")}`,
      description: `Raw material purchase — ${po.supplier.name}`,
      debit: Number(po.total),
      credit: 0,
      isCash: true,
    });
  }

  for (const s of shipments) {
    if (!s.dispatchedAt || s.freightCost == null) continue;
    entries.push({
      date: s.dispatchedAt,
      type: "FREIGHT",
      reference: `SHIP-${String(s.seq).padStart(4, "0")}`,
      description: `Freight for SO-${String(s.salesOrder.seq).padStart(4, "0")}`,
      debit: Number(s.freightCost),
      credit: 0,
      isCash: true,
    });
  }

  for (const p of payments) {
    entries.push({
      date: p.date,
      type: "PAYMENT_RECEIVED",
      reference: `INV-${String(p.invoice.seq).padStart(4, "0")}`,
      description: `Payment from ${p.invoice.customer.name} (${p.method.replace(/_/g, " ")})`,
      debit: 0,
      credit: Number(p.amount),
      isCash: true,
    });
  }

  for (const o of stripeOrders) {
    if (!o.paidAt) continue;
    entries.push({
      date: o.paidAt,
      type: "STRIPE_SALE",
      reference: `SO-${String(o.seq).padStart(4, "0")}`,
      description: `Storefront sale — ${o.customer.name}`,
      debit: 0,
      credit: Number(o.subtotal),
      isCash: true,
    });
  }

  for (const a of assets) {
    const amount = depreciationForRange(toAssetLike(a), from, to);
    if (amount > 0) {
      entries.push({
        date: to,
        type: "DEPRECIATION",
        reference: `AST-${String(a.seq).padStart(4, "0")}`,
        description: `Depreciation — ${a.name}`,
        debit: amount,
        credit: 0,
        isCash: false,
      });
    }
  }

  return entries;
}

// --- GST Summary ---

function quarterKey(date: Date) {
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${q}`;
}

export async function getGstSummary() {
  const [orders, expenses] = await Promise.all([
    db.salesOrder.findMany({
      where: { status: { in: [...REVENUE_RECOGNIZED_STATUSES] }, gstAmount: { not: null } },
      select: { orderDate: true, gstAmount: true },
    }),
    db.expense.findMany({ where: { gstAmount: { not: null } }, select: { date: true, gstAmount: true } }),
  ]);

  const quarters = new Map<string, { collected: number; paid: number }>();

  for (const o of orders) {
    const key = quarterKey(o.orderDate);
    const entry = quarters.get(key) ?? { collected: 0, paid: 0 };
    entry.collected += Number(o.gstAmount);
    quarters.set(key, entry);
  }
  for (const e of expenses) {
    const key = quarterKey(e.date);
    const entry = quarters.get(key) ?? { collected: 0, paid: 0 };
    entry.paid += Number(e.gstAmount);
    quarters.set(key, entry);
  }

  return [...quarters.entries()]
    .map(([quarter, { collected, paid }]) => ({ quarter, collected, paid, netPayable: collected - paid }))
    .sort((a, b) => (a.quarter < b.quarter ? 1 : -1));
}

// --- Dashboard ---

export async function getFinanceDashboardData() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [mtd, ytd, arAging, depreciationThisMonth, hasNullCostRecent] = await Promise.all([
    getProfitAndLoss(monthStart, now),
    getProfitAndLoss(yearStart, now),
    getArAging(),
    getDepreciationTotal(monthStart, now),
    hasAnyNullCostLine(monthStart, now),
  ]);

  return {
    revenueMtd: mtd.revenue,
    netProfitMtd: mtd.netProfit,
    revenueYtd: ytd.revenue,
    netProfitYtd: ytd.netProfit,
    arOutstanding: arAging.totalOutstanding,
    outstandingInvoiceCount: arAging.outstandingInvoiceCount,
    depreciationThisMonth,
    hasNullCostRecent,
  };
}
