import { Circle } from "lucide-react";

export function ActivityTimeline({
  items,
}: {
  items: { id: string; label: string; createdAt: Date }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pl-1">
          <div className="relative flex flex-col items-center">
            <Circle className="size-2.5 fill-primary text-primary" />
            {i < items.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <div className="min-w-0 flex-1 pb-3">
            <p className="text-sm leading-snug">{item.label}</p>
            <p className="text-xs text-muted-foreground">
              {item.createdAt.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
