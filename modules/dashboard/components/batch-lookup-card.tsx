import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BatchLookupCard() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Search className="size-4" />
          Batch Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Enter a batch number..." disabled />
          <Button type="button" disabled>
            Search
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Available once Production &amp; Batch Tracking ships (M5).
        </p>
      </CardContent>
    </Card>
  );
}
