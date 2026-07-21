// Australian GST is 10%. Storefront prices are GST-inclusive, so the GST
// component of a price is 1/11th of it (inclusive = pre-GST * 1.1, so
// GST = inclusive - inclusive/1.1 = inclusive/11). This never changes the
// total a customer pays — it's a breakdown for receipts and BAS reporting.
export function gstComponent(inclusiveAmount: number): number {
  return Math.round((inclusiveAmount / 11) * 100) / 100;
}
