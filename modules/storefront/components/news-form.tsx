"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/modules/storefront/components/image-upload-field";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type NewsItem = {
  id: string;
  title: string;
  description: string | null;
  badge: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  publishedAt: Date;
  sortOrder: number;
  isActive: boolean;
};

function toDateInputValue(date: Date | null | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
}

export function NewsForm({
  action,
  newsItem,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  newsItem?: NewsItem;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="badge">Badge (optional)</Label>
        <Input id="badge" name="badge" defaultValue={newsItem?.badge ?? ""} placeholder="e.g. Milestone, Announcement" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={newsItem?.title} placeholder="e.g. 500 Orders Delivered" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" defaultValue={newsItem?.description ?? ""} />
      </div>

      <ImageUploadField name="imageUrl" label="Image (optional)" defaultValue={newsItem?.imageUrl ?? undefined} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkUrl">Link (optional)</Label>
          <Input id="linkUrl" name="linkUrl" defaultValue={newsItem?.linkUrl ?? ""} placeholder="/shop" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="linkLabel">Button text (optional)</Label>
          <Input id="linkLabel" name="linkLabel" defaultValue={newsItem?.linkLabel ?? ""} placeholder="Shop Now" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publishedAt">Published date</Label>
        <Input
          id="publishedAt"
          name="publishedAt"
          type="date"
          required
          defaultValue={toDateInputValue(newsItem?.publishedAt)}
        />
        <p className="text-xs text-muted-foreground">
          Shown to customers and used to sort — newest first. Set this to when it actually happened, not today.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order (tie-breaker)</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={newsItem?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={newsItem?.isActive ?? true} className="size-4" />
        Visible on the public site
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/news" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
