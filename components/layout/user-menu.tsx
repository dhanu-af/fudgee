import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/rbac/permissions";

export function UserMenu({ name, roleKey }: { name: string; roleKey: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{ROLE_LABELS[roleKey] ?? roleKey}</div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
