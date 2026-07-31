"use client";

import { useState } from "react";
import Image from "next/image";
import { isOptimizableImageUrl } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--sf-primary-soft)] to-[var(--sf-accent-soft)] ring-1 ring-[var(--sf-border)]">
        <span className="font-display text-6xl font-semibold text-[var(--sf-primary)]">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl ring-1 ring-[var(--sf-border)]">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          unoptimized={!isOptimizableImageUrl(images[active])}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${name}`}
              aria-current={i === active}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-colors ${
                i === active ? "ring-[var(--sf-primary)]" : "ring-transparent hover:ring-[var(--sf-border)]"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                sizes="64px"
                className="object-cover"
                unoptimized={!isOptimizableImageUrl(src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
