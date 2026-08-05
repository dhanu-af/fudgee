"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { isOptimizableImageUrl } from "@/lib/utils";

type Props = {
  heading: string | null;
  subheading: string | null;
  imageUrl: string | null;
  images?: { imageUrl: string }[];
};

// Auto-rotates through every active HeroImage every 5s. Falls back to the
// single StorefrontSettings.heroImageUrl if no HeroImage rows exist yet, and
// to the gradient placeholder if there's neither — so sites that predate this
// feature (or haven't uploaded any hero photos) keep working unchanged.
export function HeroSection({ heading, subheading, imageUrl, images = [] }: Props) {
  const slides = images.length > 0 ? images.map((img) => img.imageUrl) : imageUrl ? [imageUrl] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--sf-bg-alt)] to-[var(--sf-bg)]">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-[var(--sf-primary-soft)] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 size-64 rounded-full bg-[var(--sf-accent-soft)] blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-6 text-left"
        >
          <span className="rounded-full bg-[var(--sf-primary-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--sf-primary)]">
            Small-batch &amp; handcrafted
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--sf-fg)] sm:text-5xl lg:text-6xl">
            {heading || "Handcrafted fudge, made with love"}
          </h1>
          <p className="max-w-md text-lg text-[var(--sf-muted)]">
            {subheading ||
              "Every batch is made by hand in small quantities, using real cream, real butter, and no shortcuts — a little luxury, delivered to your door."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-[var(--sf-primary)] px-7 py-3.5 text-sm font-semibold text-[var(--sf-primary-foreground)] shadow-md shadow-[var(--sf-primary)]/20 transition-transform hover:scale-105"
            >
              Shop Now
            </Link>
            <Link
              href="/#featured"
              className="rounded-full border border-[var(--sf-border)] bg-[var(--sf-card)] px-7 py-3.5 text-sm font-semibold text-[var(--sf-fg)] transition-colors hover:bg-[var(--sf-primary-soft)]"
            >
              Order Now
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-[2.5rem] ring-1 ring-[var(--sf-border)] lg:justify-self-end"
        >
          {slides.length > 0 ? (
            <AnimatePresence mode="sync">
              <motion.div
                key={slides[activeIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[activeIndex]}
                  alt="Fudgee handcrafted fudge"
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1024px) 448px, 90vw"
                  className="object-cover"
                  unoptimized={!isOptimizableImageUrl(slides[activeIndex])}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--sf-primary-soft)] via-[var(--sf-card)] to-[var(--sf-accent-soft)]">
              <span className="font-display text-6xl font-semibold text-[var(--sf-primary)]">fudgee.</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
