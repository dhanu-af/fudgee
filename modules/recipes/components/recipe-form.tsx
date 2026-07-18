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
import type { RecipeFormState } from "@/modules/recipes/actions";

type Option = { id: string; label: string };
type Line = { productId: string; percentage: string; uin: string };

type ExistingRecipe = {
  id: string;
  name: string | null;
  baseBatchSize: unknown;
  notes: string | null;
  product: { id: string; name: string; sku: string };
  lines: { productId: string; percentage: unknown; uin: string | null }[];
};

export function RecipeForm({
  action,
  finishedGoods,
  rawMaterials,
  recipe,
}: {
  action: (prev: RecipeFormState, formData: FormData) => Promise<RecipeFormState>;
  finishedGoods: Option[];
  rawMaterials: Option[];
  recipe?: ExistingRecipe;
}) {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(action, {});
  const [lines, setLines] = useState<Line[]>(
    recipe && recipe.lines.length > 0
      ? recipe.lines.map((l) => ({
          productId: l.productId,
          percentage: String(l.percentage),
          uin: l.uin ?? "",
        }))
      : [{ productId: rawMaterials[0]?.id ?? "", percentage: "", uin: "" }]
  );

  function addLine() {
    setLines((prev) => [...prev, { productId: rawMaterials[0]?.id ?? "", percentage: "", uin: "" }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  const totalPercentage = lines.reduce((sum, l) => sum + (Number(l.percentage) || 0), 0);

  const linesForSubmit = lines
    .filter((l) => l.productId)
    .map((l) => ({
      productId: l.productId,
      percentage: Number(l.percentage) || 0,
      uin: l.uin || undefined,
      controlStatus: "APPROVED" as const,
    }));

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <input type="hidden" name="linesJson" value={JSON.stringify(linesForSubmit)} />

      {recipe ? (
        <div className="flex flex-col gap-2">
          <Label>Finished good</Label>
          <p className="text-sm">{`${recipe.product.name} (${recipe.product.sku})`}</p>
        </div>
      ) : (
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
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Recipe name</Label>
          <Input id="name" name="name" placeholder="e.g. Standard formulation" defaultValue={recipe?.name ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="baseBatchSize">Base batch size</Label>
          <Input
            id="baseBatchSize"
            name="baseBatchSize"
            type="number"
            step="0.0001"
            min="0"
            required
            defaultValue={recipe?.baseBatchSize != null ? String(recipe.baseBatchSize) : ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={recipe?.notes ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Master Formulation — Controlled Percentage Basis</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
          {lines.map((line, index) => (
            <div key={index} className="grid grid-cols-[1fr_110px_120px_auto] items-end gap-2">
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">Ingredient / AAN</span>}
                <Select
                  value={line.productId}
                  onValueChange={(value) => updateLine(index, { productId: value ?? "" })}
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
                {index === 0 && <span className="text-xs text-muted-foreground">% w/w</span>}
                <Input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="100"
                  value={line.percentage}
                  onChange={(e) => updateLine(index, { percentage: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                {index === 0 && <span className="text-xs text-muted-foreground">UIN</span>}
                <Input value={line.uin} onChange={(e) => updateLine(index, { uin: e.target.value })} />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={lines.length === 1}
                onClick={() => removeLine(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLine} className="mt-2 w-fit">
            Add ingredient
          </Button>
        </div>
        <p className={`text-right text-sm font-medium ${Math.abs(totalPercentage - 100) > 0.01 ? "text-destructive" : ""}`}>
          Total: {totalPercentage.toFixed(4)}% {Math.abs(totalPercentage - 100) > 0.01 && "(should total 100%)"}
        </p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save recipe"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/production/recipes" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
