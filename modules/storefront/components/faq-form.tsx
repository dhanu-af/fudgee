"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StorefrontFormState } from "@/modules/storefront/actions";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export function FaqForm({
  action,
  faqItem,
}: {
  action: (prev: StorefrontFormState, formData: FormData) => Promise<StorefrontFormState>;
  faqItem?: FaqItem;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" required defaultValue={faqItem?.question} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" required defaultValue={faqItem?.answer ?? ""} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sortOrder">Display order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={faqItem?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={faqItem?.isActive ?? true} className="size-4" />
        Visible on the public site
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" render={<Link href="/storefront/faq" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
