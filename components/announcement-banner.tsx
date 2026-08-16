import { SHOW_ANNOUNCEMENT_BANNER } from "@/lib/site-config";

export function AnnouncementBanner() {
  if (!SHOW_ANNOUNCEMENT_BANNER) return null;

  return (
    <div className="border-b bg-muted/40 px-4 py-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
      <span className="font-medium tracking-wide text-foreground">
        WEBSITE UPDATE
      </span>
      <span className="mx-1.5 hidden sm:inline">&middot;</span>
      <span className="block sm:inline">
        We&rsquo;re currently updating our website and digital services. Some
        information and features may change as we complete these updates.
        Thank you for your patience as we continue to improve your
        experience.
      </span>
    </div>
  );
}
