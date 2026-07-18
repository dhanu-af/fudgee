import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>
          {session.user.mustChangePassword
            ? "You're using a temporary password. Choose a new one to continue."
            : "Update your password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
