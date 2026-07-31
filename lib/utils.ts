import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Storefront image fields accept either an upload (always lands on Vercel
// Blob) or a pasted external URL from anywhere. next/image can only
// optimize hosts listed in next.config.ts's remotePatterns (just the Blob
// host, deliberately not a full wildcard) — anything else needs
// `unoptimized` so it still renders instead of erroring.
export function isOptimizableImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com")
  } catch {
    return false
  }
}
