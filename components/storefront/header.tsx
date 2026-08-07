"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/storefront/cart-context";
import { SignOutButton } from "@/modules/customer-account/components/sign-out-button";
import logo from "@/public/logo.png";

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
    <header className="sticky top-0 z-50 bg-[var(--sf-primary)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="fudgee." priority className="h-9 w-auto sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
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
                className="text-sm font-semibold text-white/85 transition-colors hover:text-white"
              >
                {customerName.split(" ")[0]}
              </Link>
              <SignOutButton className="text-sm font-semibold text-white/85 hover:text-white" />
            </div>
          ) : (
            <Link
              href="/account/login"
              className="hidden rounded-full bg-[var(--sf-bg)] px-4 py-2 text-sm font-semibold text-[var(--sf-primary)] shadow-sm transition-transform hover:scale-105 sm:inline-block"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 items-center justify-center rounded-full text-white hover:bg-white/15 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/15 px-5 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              {link.label}
            </Link>
          ))}
          {customerName ? (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                My Account
              </Link>
              <div className="px-3 py-2">
                <SignOutButton className="text-sm font-semibold text-white/85 hover:text-white" />
              </div>
            </>
          ) : (
            <Link
              href="/account/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-[var(--sf-bg)] px-4 py-2 text-center text-sm font-semibold text-[var(--sf-primary)]"
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
