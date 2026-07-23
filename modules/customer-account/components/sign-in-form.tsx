"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInCustomer, type CustomerAuthFormState } from "@/modules/customer-account/actions";

export function SignInForm() {
  const [state, formAction, pending] = useActionState<CustomerAuthFormState, FormData>(signInCustomer, {});

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)] sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[var(--sf-fg)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[var(--sf-fg)]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-[var(--sf-primary)] px-6 py-3 text-sm font-semibold text-[var(--sf-primary-foreground)] transition-transform hover:scale-105 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-[var(--sf-muted)]">
        New here?{" "}
        <Link href="/account/signup" className="font-semibold text-[var(--sf-primary)] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
