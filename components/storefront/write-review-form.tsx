"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { submitProductReview } from "@/modules/storefront/public-actions";

export function WriteReviewForm({ productId }: { productId: string }) {
  const [state, formAction, pending] = useActionState(submitProductReview, {});
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setRating(5);
    }
  }, [state.success]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-[var(--sf-border)] px-6 py-3 text-sm font-semibold text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
      >
        Write a Review
      </button>
    );
  }

  if (state.success) {
    return (
      <p className="rounded-2xl bg-[var(--sf-primary-soft)] p-4 text-sm text-[var(--sf-fg)]">
        Thanks for your review! It&apos;ll appear here once it&apos;s been checked.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex max-w-md flex-col gap-4 rounded-2xl bg-[var(--sf-card)] p-5 ring-1 ring-[var(--sf-border)]"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--sf-fg)]">Your rating</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
              className="text-[var(--sf-accent)]"
            >
              <Star className="size-6" fill={i < rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-name" className="text-sm font-medium text-[var(--sf-fg)]">
          Name
        </label>
        <input
          id="review-name"
          name="customerName"
          required
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-body" className="text-sm font-medium text-[var(--sf-fg)]">
          Your review
        </label>
        <textarea
          id="review-body"
          name="body"
          required
          rows={3}
          className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--sf-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-60"
        >
          {pending ? "Submitting..." : "Submit review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-[var(--sf-muted)] hover:text-[var(--sf-fg)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
