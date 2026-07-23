import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { PermissionKey } from "@/lib/rbac/permissions";

// The internal ops dashboard must never be indexed — this is a meta-robots
// belt-and-suspenders alongside robots.ts disallowing these paths outright.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.mustChangePassword) redirect("/change-password");

  return (
    <div className="flex min-h-screen bg-background">
      <div className="print:hidden">
        <Sidebar permissions={session.user.permissions as PermissionKey[]} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
          <Topbar name={session.user.name ?? session.user.email ?? "User"} roleKey={session.user.roleKey} />
        </div>
        <main className="flex-1 p-6 md:p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
