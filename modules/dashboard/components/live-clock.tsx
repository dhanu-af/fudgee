"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      {now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

// Same ticking clock as LiveClock, but also watches for the calendar date
// itself rolling over (e.g. a dashboard left open past midnight) and calls
// router.refresh() the moment it does — every stat tile / quality-check
// count / chart on this Server Component page is otherwise only ever
// computed once, at the page's last load, and would keep showing whatever
// day it was fetched on until someone manually reloads.
export function LiveDate() {
  const [now, setNow] = useState<Date | null>(null);
  const router = useRouter();
  const dateKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      setNow(current);
      const key = current.toDateString();
      if (dateKeyRef.current !== null && dateKeyRef.current !== key) {
        router.refresh();
      }
      dateKeyRef.current = key;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [router]);

  if (!now) return null;

  return <>{now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</>;
}
