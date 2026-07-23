// Australian GST is 10%. Storefront prices are GST-inclusive, so the GST
// component of a price is 1/11th of it (inclusive = pre-GST * 1.1, so
// GST = inclusive - inclusive/1.1 = inclusive/11). This never changes the
// total a customer pays — it's a breakdown for receipts and BAS reporting.
export function gstComponent(inclusiveAmount: number): number {
  return Math.round((inclusiveAmount / 11) * 100) / 100;
}

// Whole-order percentage discount, rounded the same way as gstComponent so
// checkout-actions.ts and the cart page's client-side display always agree
// to the cent.
export function applyDiscount(amount: number, percent: number): number {
  return Math.round(amount * (percent / 100) * 100) / 100;
}
