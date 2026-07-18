import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComingSoonPage({
  title,
  icon: Icon,
  milestone,
}: {
  title: string;
  icon: LucideIcon;
  milestone: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/60 py-24 text-center">
      <Icon className="size-10 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Badge variant="secondary">{milestone}</Badge>
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        This module isn&apos;t built yet — it&apos;s planned for {milestone}.
      </p>
    </div>
  );
}
