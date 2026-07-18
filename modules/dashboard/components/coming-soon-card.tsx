import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ComingSoonCard({
  title,
  icon: Icon,
  milestone,
}: {
  title: string;
  icon: LucideIcon;
  milestone: string;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="size-4" />
          {title}
        </CardTitle>
        <Badge variant="secondary">{milestone}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This module isn&apos;t built yet — it&apos;ll show live data here once it ships.
        </p>
      </CardContent>
    </Card>
  );
}
