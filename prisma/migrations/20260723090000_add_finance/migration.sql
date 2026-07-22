-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SalesOrderLine" ADD COLUMN     "unitCostAtSale" DECIMAL(14,4);

-- CreateEnum
CREATE TYPE "FinanceExpenseCategory" AS ENUM ('RENT', 'UTILITIES', 'SALARIES_WAGES', 'MARKETING', 'PACKAGING_SUPPLIES', 'MAINTENANCE', 'INSURANCE', 'OFFICE_SUPPLIES', 'PROFESSIONAL_FEES', 'CAPITAL_ASSET_PURCHASE', 'OTHER');

-- CreateEnum
CREATE TYPE "FinancePaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CARD', 'STRIPE', 'CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('MACHINERY', 'VEHICLE', 'BUILDING', 'FURNITURE_FIXTURES', 'IT_EQUIPMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'DISPOSED');

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "FinanceExpenseCategory" NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "gstAmount" DECIMAL(14,4),
    "paymentMethod" "FinancePaymentMethod" NOT NULL,
    "note" TEXT,
    "supplierId" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchaseCost" DECIMAL(14,4) NOT NULL,
    "salvageValue" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "depreciationPeriodMonths" INTEGER NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "disposedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "totalAmount" DECIMAL(14,4) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSalesOrder" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "salesOrderId" TEXT NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "InvoiceSalesOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoicePayment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(14,4) NOT NULL,
    "method" "FinancePaymentMethod" NOT NULL,
    "reference" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSalesOrder_salesOrderId_key" ON "InvoiceSalesOrder"("salesOrderId");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSalesOrder" ADD CONSTRAINT "InvoiceSalesOrder_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSalesOrder" ADD CONSTRAINT "InvoiceSalesOrder_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoicePayment" ADD CONSTRAINT "InvoicePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Manual data fix (not Prisma-generated): backfill unitCostAtSale on every
-- existing SalesOrderLine from the product's current costPrice, so historical
-- orders aren't permanently excluded from COGS/margin reporting. This is an
-- approximation — it uses today's cost, not the cost at the time of that
-- historical sale — which is exactly the gap unitCostAtSale exists to close
-- going forward. The Finance P&L page shows a warning banner whenever any
-- in-range line still has a null unitCostAtSale.
UPDATE "SalesOrderLine" AS sol
SET "unitCostAtSale" = p."costPrice"
FROM "Product" AS p
WHERE sol."productId" = p.id AND sol."unitCostAtSale" IS NULL;
