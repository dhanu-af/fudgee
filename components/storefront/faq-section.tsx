"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";

type FaqItem = { id: string; question: string; answer: string };

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-[var(--sf-bg-alt)] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">FAQ</span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--sf-fg)] sm:text-4xl">
            Questions, answered
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <Reveal key={item.id} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl bg-[var(--sf-card)] ring-1 ring-[var(--sf-border)]">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-[var(--sf-fg)]">{item.question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-[var(--sf-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--sf-muted)]">{item.answer}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
