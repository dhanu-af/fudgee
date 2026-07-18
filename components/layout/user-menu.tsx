import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/rbac/permissions";

export function UserMenu({ name, roleKey }: { name: string; roleKey: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {initial}
      </div>
      <div className="hidden text-sm sm:block">
        <div className="font-medium leading-tight">{name}</div>
        <div className="text-xs text-muted-foreground">{ROLE_LABELS[roleKey] ?? roleKey}</div>
      </div>
      <Button variant="outline" size="sm" render={<Link href="/change-password" />}>
        Change Password
      </Button>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline" size="sm">
          Log out
        </Button>
      </form>
    </div>
  );
}
