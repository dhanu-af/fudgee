"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modulesForPermissions } from "@/lib/registry/modules";
import type { PermissionKey } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";

const GROUP_LABELS: Record<string, string> = {
  core: "",
  operations: "Operations",
  insights: "Insights",
  admin: "Admin",
};

export function Sidebar({ permissions }: { permissions: PermissionKey[] }) {
  const modules = modulesForPermissions(permissions);
  const groups = ["core", "operations", "insights", "admin"] as const;
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30">
          F
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold leading-tight">Fudgee</div>
          <div className="truncate text-[11px] text-muted-foreground">Manufacturing Operations</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4">
        {groups.map((group) => {
          const items = modules.filter((m) => m.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              {GROUP_LABELS[group] && (
                <div className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {GROUP_LABELS[group]}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                  return (
                    <Link
                      key={item.key}
                      href={item.route}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-primary" />
                      )}
                      <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
                      <span className="truncate">{item.label}</span>
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
