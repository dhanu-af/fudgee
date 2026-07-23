"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/modules/storefront/components/image-upload-field";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: number;
  isActive: boolean;
};

function toDateInputValue(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export function PromotionForm({
  action,
  promotion,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  promotion?: Promotion;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={promotion?.title} placeholder="e.g. 20% Off This Week" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" defaultValue={promotion?.description ?? ""} />
      </div>

      <ImageUploadField name="imageUrl" label="Banner image (optional)" defaultValue={promotion?.imageUrl ?? undefined} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkUrl">Link (optional)</Label>
          <Input id="linkUrl" name="linkUrl" defaultValue={promotion?.linkUrl ?? ""} placeholder="/shop" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkLabel">Button text (optional)</Label>
          <Input id="linkLabel" name="linkLabel" defaultValue={promotion?.linkLabel ?? ""} placeholder="Shop Now" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Start date (optional)</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={toDateInputValue(promotion?.startDate ?? null)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">End date (optional)</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={toDateInputValue(promotion?.endDate ?? null)} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Leave both blank to run indefinitely once turned on, or set a window to have it start/stop on its own.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={promotion?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={promotion?.isActive ?? true} className="size-4" />
        Visible on the public site
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/promotions" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
