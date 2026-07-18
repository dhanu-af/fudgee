type InputLine = { quantity: unknown; product: { costPrice: unknown } };

export function computeBatchCosting(
  inputs: InputLine[],
  quantityActual: number,
  sellPrice: number | null
) {
  const totalRawMaterialCost = inputs.reduce(
    (sum, input) => sum + Number(input.quantity) * Number(input.product.costPrice ?? 0),
    0
  );
  const avgCostPerUnit = quantityActual > 0 ? totalRawMaterialCost / quantityActual : null;
  const profitPerUnit = avgCostPerUnit !== null && sellPrice !== null ? sellPrice - avgCostPerUnit : null;
  const totalProfit = profitPerUnit !== null ? profitPerUnit * quantityActual : null;

  return { totalRawMaterialCost, avgCostPerUnit, profitPerUnit, totalProfit };
}
