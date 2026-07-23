import { signOutCustomer } from "@/modules/customer-account/actions";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutCustomer}>
      <button
        type="submit"
        className={className ?? "text-sm font-semibold text-[var(--sf-fg)]/80 hover:text-[var(--sf-primary)]"}
      >
        Sign out
      </button>
    </form>
  );
}
