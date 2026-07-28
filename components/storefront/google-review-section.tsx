import { Star } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.12A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.27a12 12 0 0 0 0 10.78z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.12C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function GoogleReviewSection({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <section className="bg-[var(--sf-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal className="flex flex-col items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--sf-card)] shadow-md ring-1 ring-[var(--sf-border)]">
            <GoogleIcon className="size-7" />
          </span>
          <div className="flex items-center gap-1 text-[#FBBC05]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            Loved your Fudgee order?
          </h2>
          <p className="max-w-xl text-[var(--sf-muted)] sm:text-lg">
            We&apos;d love your feedback — a quick Google review helps other fudge lovers find us, and it only
            takes a minute.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--sf-primary)] px-8 py-3.5 text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
          >
            <GoogleIcon className="size-5" />
            Post a Google Review
          </a>
        </Reveal>
      </div>
    </section>
  );
}
