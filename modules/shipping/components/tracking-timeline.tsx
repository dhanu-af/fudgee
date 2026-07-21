type TrackingEventRow = { id: string; status: string; location: string | null; note: string | null; occurredAt: Date };

export function TrackingTimeline({ events }: { events: TrackingEventRow[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No tracking updates yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5 text-primary">✓</span>
          <div>
            <span className="font-medium">{event.status}</span>
            {event.location && <span className="text-muted-foreground"> — {event.location}</span>}
            <div className="text-xs text-muted-foreground">
              {new Date(event.occurredAt).toLocaleString()}
              {event.note ? ` · ${event.note}` : ""}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
