import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { SignUpForm } from "@/modules/customer-account/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  const customer = await getCustomerSession();
  if (customer) redirect("/account");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-5 py-16 sm:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)]">Create an account</h1>
        <p className="mt-1 text-sm text-[var(--sf-muted)]">Track your orders and shipping in one place.</p>
      </div>
      <SignUpForm />
    </div>
  );
}
