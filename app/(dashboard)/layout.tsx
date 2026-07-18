import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { PermissionKey } from "@/lib/rbac/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.mustChangePassword) redirect("/change-password");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar permissions={session.user.permissions as PermissionKey[]} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={session.user.name ?? session.user.email ?? "User"} roleKey={session.user.roleKey} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
