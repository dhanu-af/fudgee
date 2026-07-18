"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createQualityCheck, type QualityCheckFormState } from "@/modules/quality/actions";

type BatchOption = { id: string; label: string };

export function QualityCheckForm({ batches }: { batches: BatchOption[] }) {
  const [state, formAction, pending] = useActionState<QualityCheckFormState, FormData>(createQualityCheck, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="productionBatchId">Production batch</Label>
        <Select
          name="productionBatchId"
          defaultValue={batches[0]?.id}
          items={Object.fromEntries(batches.map((b) => [b.id, b.label]))}
        >
          <SelectTrigger id="productionBatchId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="result">Result</Label>
        <Select name="result" defaultValue="PASS" items={{ PASS: "Pass", FAIL: "Fail", PENDING: "Pending" }}>
          <SelectTrigger id="result">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PASS">Pass</SelectItem>
            <SelectItem value="FAIL">Fail</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Record check"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/quality" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
