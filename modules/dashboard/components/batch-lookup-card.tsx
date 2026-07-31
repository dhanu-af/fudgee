"use client";

import { useActionState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lookupProductionBatch } from "@/modules/dashboard/actions";

export function BatchLookupCard() {
  const [state, formAction, pending] = useActionState(lookupProductionBatch, {});

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Search className="size-4" />
          Batch Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex gap-2">
          <Input name="batchNumber" placeholder="Enter a batch number..." />
          <Button type="submit" disabled={pending}>
            {pending ? "Searching..." : "Search"}
          </Button>
        </form>
        {state.error && <p className="mt-2 text-xs text-destructive">{state.error}</p>}
      </CardContent>
    </Card>
  );
}
