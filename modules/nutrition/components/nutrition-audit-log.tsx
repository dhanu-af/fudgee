type AuditLogRow = {
  id: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
  changedAt: Date;
  changedByUser: { name: string } | null;
};

export function NutritionAuditLog({ entries }: { entries: AuditLogRow[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No manual changes recorded yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {entries.map((entry) => (
        <li key={entry.id} className="text-muted-foreground">
          <span className="font-medium text-foreground">{entry.field}</span>
          {": "}
          {entry.oldValue ?? "—"} → {entry.newValue ?? "—"}
          {" · "}
          {entry.changedByUser?.name ?? "Unknown"} · {new Date(entry.changedAt).toLocaleString()}
          {entry.reason && ` · ${entry.reason}`}
        </li>
      ))}
    </ul>
  );
}
