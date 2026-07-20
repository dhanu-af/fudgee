"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function GalleryForm({
  action,
  item,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  item?: GalleryItem;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" required defaultValue={item?.imageUrl} />
        <p className="text-xs text-muted-foreground">A hosted image link (e.g. from your phone&apos;s cloud photo backup).</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="caption">Caption</Label>
        <Input id="caption" name="caption" defaultValue={item?.caption ?? ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={item?.isActive ?? true} className="size-4" />
        Visible on the public site
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/gallery" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
