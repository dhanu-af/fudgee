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
import type { StorefrontFormState } from "@/modules/storefront/actions";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  body: string;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
};

export function ReviewForm({
  action,
  review,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  review?: Review;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customerName">Customer name</Label>
        <Input id="customerName" name="customerName" required defaultValue={review?.customerName} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rating">Rating</Label>
        <Select name="rating" defaultValue={String(review?.rating ?? 5)} items={{ "5": "5 stars", "4": "4 stars", "3": "3 stars", "2": "2 stars", "1": "1 star" }}>
          <SelectTrigger id="rating">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 stars</SelectItem>
            <SelectItem value="4">4 stars</SelectItem>
            <SelectItem value="3">3 stars</SelectItem>
            <SelectItem value="2">2 stars</SelectItem>
            <SelectItem value="1">1 star</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="body">Review text</Label>
        <Textarea id="body" name="body" required defaultValue={review?.body ?? ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={review?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeatured" defaultChecked={review?.isFeatured ?? true} className="size-4" />
        Show in the homepage reviews section
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={review?.isActive ?? true} className="size-4" />
        Active
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/reviews" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
