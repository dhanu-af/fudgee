function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2c-5.523 0-10 4.477-10 10 0 1.765.457 3.497 1.324 5.02L2 22l5.117-1.342A9.94 9.94 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.033a8.01 8.01 0 0 1-4.086-1.117l-.293-.174-3.037.797.812-2.96-.19-.303A8.008 8.008 0 0 1 3.967 12c0-4.436 3.596-8.033 8.033-8.033S20.033 7.564 20.033 12 16.436 20.033 12 20.033z" />
    </svg>
  );
}

export function WhatsAppCommunityCard({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--sf-primary-soft)] to-[var(--sf-accent-soft)] p-6 ring-1 ring-[var(--sf-border)] transition-shadow hover:shadow-lg sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform group-hover:scale-105">
              <WhatsAppIcon className="size-6" />
            </span>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-2xl">
              🍪 Fudgee Family | Official Community
            </h2>
            <span className="rounded-full bg-[var(--sf-card)] px-3 py-1 text-xs font-semibold text-[var(--sf-primary)] ring-1 ring-[var(--sf-border)]">
              500+ Members
            </span>
          </div>
          <p className="max-w-xl text-sm text-[var(--sf-muted)] sm:text-base">
            Join Australia&apos;s sweetest cookie community! Get exclusive discounts, early access to new flavours,
            giveaways, behind-the-scenes updates, and chat directly with the Fudgee team.
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--sf-primary)] px-8 py-3.5 text-base font-semibold text-[var(--sf-primary-foreground)] shadow-md transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="size-5" />
          Join WhatsApp Community
        </a>
      </div>
    </div>
  );
}
