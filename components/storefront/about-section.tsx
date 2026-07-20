import { Reveal } from "@/components/storefront/reveal";

type Props = {
  heading: string | null;
  body: string | null;
  imageUrl: string | null;
};

export function AboutSection({ heading, body, imageUrl }: Props) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] ring-1 ring-[var(--sf-border)]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--sf-accent-soft)] to-[var(--sf-primary-soft)]">
              <span className="font-display text-5xl font-semibold text-[var(--sf-primary)]">fudgee.</span>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">Our story</span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            {heading || "Made by hand, one batch at a time"}
          </h2>
          <p className="whitespace-pre-line text-[var(--sf-muted)]">
            {body ||
              "Fudgee started in a home kitchen with one recipe and a lot of stirring. Today, every batch is still made by hand in small quantities — real cream, real butter, no shortcuts — because that's the only way we know how to do it right."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
