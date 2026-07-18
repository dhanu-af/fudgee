import { Bell } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function Topbar({ name, roleKey }: { name: string; roleKey: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-2 border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Notifications (coming soon)"
        disabled
      >
        <Bell className="size-4" />
      </Button>
      <ThemeToggle />
      <div className="mx-1 h-6 w-px bg-border" />
      <UserMenu name={name} roleKey={roleKey} />
    </header>
  );
}
