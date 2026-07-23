function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function FacebookFanPageCard({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--sf-primary-soft)] to-[var(--sf-accent-soft)] p-6 ring-1 ring-[var(--sf-border)] transition-shadow hover:shadow-lg sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition-transform group-hover:scale-105">
              <FacebookIcon className="size-6" />
            </span>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-2xl">
              👍 Fudgee Family | Facebook Page
            </h2>
            <span className="rounded-full bg-[var(--sf-card)] px-3 py-1 text-xs font-semibold text-[var(--sf-primary)] ring-1 ring-[var(--sf-border)]">
              2,000+ Followers
            </span>
          </div>
          <p className="max-w-xl text-sm text-[var(--sf-muted)] sm:text-base">
            Follow Fudgee on Facebook for daily updates, customer photos, live videos, exclusive Facebook-only deals,
            and the first word on new flavours and pop-up events.
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--sf-primary)] px-8 py-3.5 text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
        >
          <FacebookIcon className="size-5" />
          Follow on Facebook
        </a>
      </div>
    </div>
  );
}
