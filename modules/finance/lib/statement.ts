// The Statement is a computed-on-the-fly unified ledger, not a stored table —
// same pragmatic single-ledger design as Dhanu's other finance system, no
// double-entry chart-of-accounts. Depreciation entries are flagged
// `isCash: false` so a running *cash* balance can exclude them if needed,
// while still showing up in the accrual view.

export type StatementEntryType = "EXPENSE" | "PURCHASE" | "FREIGHT" | "DEPRECIATION" | "PAYMENT_RECEIVED" | "STRIPE_SALE";

export type StatementEntry = {
  date: Date;
  type: StatementEntryType;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  isCash: boolean;
};

export type StatementEntryWithBalance = StatementEntry & { balance: number };

export function sortStatementEntries(entries: StatementEntry[]): StatementEntry[] {
  return [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function withRunningBalance(entries: StatementEntry[], openingBalance = 0): StatementEntryWithBalance[] {
  let balance = openingBalance;
  return sortStatementEntries(entries).map((entry) => {
    balance += entry.credit - entry.debit;
    return { ...entry, balance };
  });
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(rows: StatementEntryWithBalance[]): string {
  const header = ["Date", "Type", "Reference", "Description", "Debit", "Credit", "Balance"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.date.toISOString().slice(0, 10),
        r.type,
        csvEscape(r.reference),
        csvEscape(r.description),
        r.debit.toFixed(2),
        r.credit.toFixed(2),
        r.balance.toFixed(2),
      ].join(",")
    );
  }
  return lines.join("\n");
}
