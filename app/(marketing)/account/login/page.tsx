import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { SignInForm } from "@/modules/customer-account/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function AccountLoginPage() {
  const customer = await getCustomerSession();
  if (customer) redirect("/account");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-5 py-16 sm:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)]">Sign In</h1>
        <p className="mt-1 text-sm text-[var(--sf-muted)]">Welcome back — sign in to see your orders.</p>
      </div>
      <SignInForm />
    </div>
  );
}
