import Link from "next/link";
import { modulesForPermissions } from "@/lib/registry/modules";
import type { PermissionKey } from "@/lib/rbac/permissions";

const GROUP_LABELS: Record<string, string> = {
  core: "",
  operations: "Operations",
  insights: "Insights",
  admin: "Admin",
};

export function Sidebar({ permissions }: { permissions: PermissionKey[] }) {
  const modules = modulesForPermissions(permissions);
  const groups = ["core", "operations", "insights", "admin"] as const;

  return (
    <aside className="w-56 shrink-0 border-r bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-4 text-lg font-semibold">Fudgee</div>
      <nav className="flex flex-col gap-4 px-2">
        {groups.map((group) => {
          const items = modules.filter((m) => m.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              {GROUP_LABELS[group] && (
                <div className="px-2 pb-1 text-xs font-medium uppercase text-muted-foreground">
                  {GROUP_LABELS[group]}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.route}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
