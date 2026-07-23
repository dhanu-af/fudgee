import { Reveal } from "@/components/storefront/reveal";

type GalleryItem = { id: string; imageUrl: string; caption: string | null };

export function GallerySection({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="bg-[var(--sf-bg-alt)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Gallery</span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            A little taste of what we make
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.05}
              className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}
            >
              <figure className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-[var(--sf-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Fudgee handcrafted fudge and confections"}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
