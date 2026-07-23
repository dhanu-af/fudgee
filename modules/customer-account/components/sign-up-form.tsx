"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpCustomer, type CustomerAuthFormState } from "@/modules/customer-account/actions";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState<CustomerAuthFormState, FormData>(signUpCustomer, {});

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[var(--sf-card)] p-6 ring-1 ring-[var(--sf-border)] sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-[var(--sf-fg)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

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
        <label htmlFor="phone" className="text-sm font-medium text-[var(--sf-fg)]">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
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
          minLength={8}
          required
          className="h-11 rounded-xl border border-[var(--sf-border)] bg-[var(--sf-bg)] px-4 text-sm outline-none focus:border-[var(--sf-primary)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--sf-fg)]">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={8}
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
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-[var(--sf-muted)]">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-[var(--sf-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
