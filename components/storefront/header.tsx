"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";
import { SignOutButton } from "@/modules/customer-account/components/sign-out-button";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function StorefrontHeader({ customerName }: { customerName?: string | null }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sf-border)] bg-[var(--sf-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-primary)] sm:text-4xl">
          fudgee.
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--sf-fg)]/80 transition-colors hover:text-[var(--sf-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex size-9 items-center justify-center rounded-full text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--sf-accent)] text-[10px] font-bold text-[var(--sf-accent-foreground)]">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          {customerName ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/account"
                className="text-sm font-semibold text-[var(--sf-fg)]/80 transition-colors hover:text-[var(--sf-primary)]"
              >
                {customerName.split(" ")[0]}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/account/login"
              className="hidden rounded-full bg-[var(--sf-primary)] px-4 py-2 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-sm transition-transform hover:scale-105 sm:inline-block"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--sf-fg)] hover:bg-[var(--sf-primary-soft)] md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--sf-border)] px-5 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--sf-fg)] hover:bg-[var(--sf-primary-soft)]"
            >
              {link.label}
            </Link>
          ))}
          {customerName ? (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--sf-fg)] hover:bg-[var(--sf-primary-soft)]"
              >
                My Account
              </Link>
              <div className="px-3 py-2">
                <SignOutButton />
              </div>
            </>
          ) : (
            <Link
              href="/account/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-[var(--sf-primary)] px-4 py-2 text-center text-sm font-semibold text-[var(--sf-primary-foreground)]"
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
