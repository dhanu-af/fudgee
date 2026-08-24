import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";
import { isOptimizableImageUrl } from "@/lib/utils";

type NewsItem = {
  id: string;
  title: string;
  description: string | null;
  badge: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  publishedAt: Date;
};

export function NewsSection({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="news" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">News</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
          Straight from the kitchen
        </h2>
      </Reveal>

      <div className={`grid gap-5 ${items.length === 1 ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.07} className={items.length === 1 ? "mx-auto w-full max-w-2xl" : ""}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[var(--sf-card)] ring-1 ring-[var(--sf-border)]">
              {item.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={!isOptimizableImageUrl(item.imageUrl)}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sf-primary-soft)] text-[var(--sf-primary)]">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">
                    {item.badge || "Announcement"}
                  </span>
                  <span className="ml-auto text-xs text-[var(--sf-muted)]">
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-2xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="flex-1 text-sm leading-relaxed text-[var(--sf-fg)]/80">{item.description}</p>
                )}
                {item.linkUrl && (
                  <Link
                    href={item.linkUrl}
                    className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--sf-primary)] px-5 py-2 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
                  >
                    {item.linkLabel || "Learn more"}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
