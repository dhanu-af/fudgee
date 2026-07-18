import Link from "next/link";
import { cn } from "@/lib/utils";

export function TabNav({ tabs, active }: { tabs: { label: string; href: string }[]; active: string }) {
  return (
    <div className="flex gap-1 border-b border-border/60">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
            tab.href === active
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
