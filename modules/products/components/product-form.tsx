"use client";

import { useActionState } from "react";
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
import type { ProductFormState } from "@/modules/products/actions";

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  type: string;
  uom: string;
  status: string;
  costPrice: unknown;
  sellPrice: unknown;
  reorderPoint: unknown;
};

export function ProductForm({
  action,
  product,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" required defaultValue={product?.sku} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="uom">Unit of measure</Label>
          <Input id="uom" name="uom" required placeholder="EA, KG, L..." defaultValue={product?.uom} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={product?.type ?? "FINISHED_GOOD"}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FINISHED_GOOD">Finished good</SelectItem>
              <SelectItem value="RAW_MATERIAL">Raw material</SelectItem>
              <SelectItem value="PACKAGING">Packaging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={product?.status ?? "ACTIVE"}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="costPrice">Cost price</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" defaultValue={product?.costPrice as number | undefined} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sellPrice">Sell price</Label>
          <Input id="sellPrice" name="sellPrice" type="number" step="0.01" defaultValue={product?.sellPrice as number | undefined} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reorderPoint">Reorder point</Label>
          <Input id="reorderPoint" name="reorderPoint" type="number" step="0.01" defaultValue={product?.reorderPoint as number | undefined} />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/products" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
