"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSET_CATEGORIES, ASSET_STATUSES } from "@/modules/finance/schema";
import type { FinanceFormState } from "@/modules/finance/actions";

type Asset = {
  name: string;
  category: string;
  purchaseDate: Date;
  purchaseCost: unknown;
  salvageValue: unknown;
  depreciationPeriodMonths: number;
  status: string;
  disposedAt: Date | null;
  notes: string | null;
};

export function AssetForm({
  action,
  asset,
}: {
  action: (prev: FinanceFormState, formData: FormData) => Promise<FinanceFormState>;
  asset?: Asset;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const purchaseDateValue = asset ? new Date(asset.purchaseDate).toISOString().slice(0, 10) : undefined;
  const disposedAtValue = asset?.disposedAt ? new Date(asset.disposedAt).toISOString().slice(0, 10) : undefined;

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={asset?.name} placeholder="e.g. Depositor machine" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={asset?.category ?? "MACHINERY"} items={Object.fromEntries(ASSET_CATEGORIES.map((c) => [c, c.replace(/_/g, " ")]))}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSET_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={asset?.status ?? "ACTIVE"} items={Object.fromEntries(ASSET_STATUSES.map((s) => [s, s]))}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSET_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="purchaseDate">Purchase date</Label>
          <Input id="purchaseDate" name="purchaseDate" type="date" required defaultValue={purchaseDateValue} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="purchaseCost">Purchase cost</Label>
          <Input
            id="purchaseCost"
            name="purchaseCost"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={asset ? Number(asset.purchaseCost) : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="salvageValue">Salvage value (optional)</Label>
          <Input
            id="salvageValue"
            name="salvageValue"
            type="number"
            step="0.01"
            min="0"
            defaultValue={asset ? Number(asset.salvageValue) : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="depreciationPeriodMonths">Depreciation period (months)</Label>
          <Input
            id="depreciationPeriodMonths"
            name="depreciationPeriodMonths"
            type="number"
            step="1"
            min="1"
            required
            defaultValue={asset?.depreciationPeriodMonths}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="disposedAt">Disposed on (optional)</Label>
        <Input id="disposedAt" name="disposedAt" type="date" defaultValue={disposedAtValue} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" defaultValue={asset?.notes ?? ""} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/finance/assets" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
