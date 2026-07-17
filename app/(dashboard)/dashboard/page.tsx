import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export default async function DashboardPage() {
  const session = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);

  return (
    <div>
      <h1 className="text-xl font-semibold">Executive Dashboard</h1>
      <p className="text-muted-foreground">
        Signed in as {session.user.email} ({session.user.roleKey}). KPIs land in M6.
      </p>
    </div>
  );
}
