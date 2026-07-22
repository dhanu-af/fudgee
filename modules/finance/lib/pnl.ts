// Revenue is recognized on order confirmation (accrual), not on payment
// receipt — matches how the rest of the app already treats a CONFIRMED order
// as real (inventory/shipping flow off it too), rather than introducing a
// second, inconsistent notion of "real" tied to Finance alone.

export type SalesOrderForPnl = {
  subtotal: unknown;
  lines: { quantity: unknown; unitCostAtSale: unknown | null }[];
};

export function computeRevenueAndCogs(orders: SalesOrderForPnl[]) {
  let revenue = 0;
  let cogs = 0;
  let hasNullCost = false;

  for (const order of orders) {
    revenue += Number(order.subtotal);
    for (const line of order.lines) {
      if (line.unitCostAtSale == null) {
        hasNullCost = true;
        continue;
      }
      cogs += Number(line.quantity) * Number(line.unitCostAtSale);
    }
  }

  return { revenue, cogs, hasNullCost };
}

export type ProfitAndLoss = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  freightCost: number;
  expenseCost: number;
  depreciation: number;
  netProfit: number;
  hasNullCost: boolean;
};

export function computeProfitAndLoss(params: {
  orders: SalesOrderForPnl[];
  expenseTotal: number;
  freightTotal: number;
  depreciationTotal: number;
}): ProfitAndLoss {
  const { revenue, cogs, hasNullCost } = computeRevenueAndCogs(params.orders);
  const grossProfit = revenue - cogs;
  const opex = params.expenseTotal + params.freightTotal;
  const netProfit = grossProfit - opex - params.depreciationTotal;

  return {
    revenue,
    cogs,
    grossProfit,
    opex,
    expenseCost: params.expenseTotal,
    freightCost: params.freightTotal,
    depreciation: params.depreciationTotal,
    netProfit,
    hasNullCost,
  };
}

export type CustomerProfitability = {
  customerId: string;
  customerName: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
};

// Gross profit per customer only — OpEx/Depreciation aren't allocated per
// customer, since any allocation basis (e.g. proportional to revenue) would
// be arbitrary and less trustworthy than simply not claiming it.
export function computeCustomerProfitability(
  orders: (SalesOrderForPnl & { customerId: string; customerName: string })[]
): CustomerProfitability[] {
  const byCustomer = new Map<string, CustomerProfitability>();

  for (const order of orders) {
    const entry = byCustomer.get(order.customerId) ?? {
      customerId: order.customerId,
      customerName: order.customerName,
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
    };
    entry.revenue += Number(order.subtotal);
    for (const line of order.lines) {
      if (line.unitCostAtSale != null) {
        entry.cogs += Number(line.quantity) * Number(line.unitCostAtSale);
      }
    }
    entry.grossProfit = entry.revenue - entry.cogs;
    byCustomer.set(order.customerId, entry);
  }

  return [...byCustomer.values()].sort((a, b) => b.revenue - a.revenue);
}
