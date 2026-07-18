"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductionBatch, type ProductionBatchFormState } from "@/modules/production/actions";

type Option = { id: string; label: string };
type InputLine = { productId: string; quantity: string };

export function ProductionBatchForm({
  finishedGoods,
  rawMaterials,
}: {
  finishedGoods: Option[];
  rawMaterials: Option[];
}) {
  const [state, formAction, pending] = useActionState<ProductionBatchFormState, FormData>(createProductionBatch, {});
  const [inputs, setInputs] = useState<InputLine[]>([{ productId: rawMaterials[0]?.id ?? "", quantity: "1" }]);

  function addInput() {
    setInputs((prev) => [...prev, { productId: rawMaterials[0]?.id ?? "", quantity: "1" }]);
  }

  function removeInput(index: number) {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInput(index: number, patch: Partial<InputLine>) {
    setInputs((prev) => prev.map((input, i) => (i === index ? { ...input, ...patch } : input)));
  }

  const inputsForSubmit = inputs
    .filter((i) => i.productId)
    .map((i) => ({ productId: i.productId, quantity: Number(i.quantity) || 0 }));

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="inputsJson" value={JSON.stringify(inputsForSubmit)} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="productId">Finished good</Label>
          <Select
            name="productId"
            defaultValue={finishedGoods[0]?.id}
            items={Object.fromEntries(finishedGoods.map((p) => [p.id, p.label]))}
          >
            <SelectTrigger id="productId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {finishedGoods.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantityPlanned">Planned quantity</Label>
          <Input id="quantityPlanned" name="quantityPlanned" type="number" step="0.01" min="0" required defaultValue="1" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Raw material inputs</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
          {inputs.map((input, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_auto] items-end gap-2">
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Raw material</span>}
                <Select
                  value={input.productId}
                  onValueChange={(value) => updateInput(index, { productId: value ?? "" })}
                  items={Object.fromEntries(rawMaterials.map((p) => [p.id, p.label]))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterials.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Qty</span>}
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={input.quantity}
                  onChange={(e) => updateInput(index, { quantity: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={inputs.length === 1}
                onClick={() => removeInput(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addInput} className="mt-2 w-fit">
            Add input
          </Button>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create batch"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/production" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
