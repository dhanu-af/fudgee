import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Fudgee",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--sf-fg)]">Cookie Policy</h1>
      <p className="mt-2 text-sm text-[var(--sf-fg)]/60">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-[var(--sf-fg)]/80">
        <p>
          Fudgee uses a small number of cookies to keep the site working
          properly.
        </p>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Cart</h2>
          <p className="mt-2">
            We store your shopping cart contents in your browser&apos;s local
            storage so it&apos;s still there if you come back later. This
            stays on your device and isn&apos;t shared with us until you check
            out.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--sf-fg)]">Sign-in</h2>
          <p className="mt-2">
            If you sign in as staff, a session cookie keeps you logged in
            while you use the site.
          </p>
        </section>
      </div>
    </div>
  );
}
