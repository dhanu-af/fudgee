import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? undefined : v));

// z.coerce.number() turns "" into 0 (Number("") === 0), not NaN, so a plain
// .optional().or(z.nan()...) fallback never fires for a blank input — same
// gotcha fixed in modules/nutrition/schema.ts and modules/products/schema.ts.
// Preprocessing blank/missing to undefined first is the fix, so every money
// field in this module uses it rather than the broken pattern.
const optionalNumber = () =>
  z.preprocess((val) => (val === "" || val == null ? undefined : val), z.coerce.number().nonnegative().optional());

const requiredAmount = (message = "Must be a positive number") =>
  z.preprocess((val) => (val === "" || val == null ? undefined : val), z.coerce.number().positive(message));

const requiredInt = (message: string) =>
  z.preprocess((val) => (val === "" || val == null ? undefined : val), z.coerce.number().int().positive(message));

export const EXPENSE_CATEGORIES = [
  "RENT",
  "UTILITIES",
  "SALARIES_WAGES",
  "MARKETING",
  "PACKAGING_SUPPLIES",
  "MAINTENANCE",
  "INSURANCE",
  "OFFICE_SUPPLIES",
  "PROFESSIONAL_FEES",
  "CAPITAL_ASSET_PURCHASE",
  "OTHER",
] as const;

export const PAYMENT_METHODS = ["CASH", "BANK_TRANSFER", "CARD", "STRIPE", "CHEQUE", "OTHER"] as const;

export const ASSET_CATEGORIES = ["MACHINERY", "VEHICLE", "BUILDING", "FURNITURE_FIXTURES", "IT_EQUIPMENT", "OTHER"] as const;

export const ASSET_STATUSES = ["ACTIVE", "DISPOSED"] as const;

export const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(EXPENSE_CATEGORIES),
  amount: requiredAmount("Amount must be greater than 0"),
  gstAmount: optionalNumber(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  note: optionalText(1000),
  supplierId: optionalText(64),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export const assetSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum(ASSET_CATEGORIES),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  purchaseCost: requiredAmount("Purchase cost must be greater than 0"),
  salvageValue: optionalNumber(),
  depreciationPeriodMonths: requiredInt("Depreciation period must be a whole number of months"),
  status: z.enum(ASSET_STATUSES),
  disposedAt: optionalText(20),
  notes: optionalText(2000),
});
export type AssetInput = z.infer<typeof assetSchema>;

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  dueDate: optionalText(20),
  notes: optionalText(2000),
  salesOrderIdsJson: z.string().min(1, "Select at least one sales order to invoice"),
});
export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const invoicePaymentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: requiredAmount("Payment amount must be greater than 0"),
  method: z.enum(PAYMENT_METHODS),
  reference: optionalText(200),
  note: optionalText(1000),
});
export type InvoicePaymentInput = z.infer<typeof invoicePaymentSchema>;

export const financeRangeSchema = z.object({
  from: z.string().optional().or(z.literal("")),
  to: z.string().optional().or(z.literal("")),
});
export type FinanceRangeInput = z.infer<typeof financeRangeSchema>;
