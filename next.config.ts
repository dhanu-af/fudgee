import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Storefront image fields accept either an upload (always lands on
    // Vercel Blob, matched here so next/image can optimize it) or a pasted
    // external URL (any host — components fall back to `unoptimized` for
    // those instead of widening this to a full wildcard, which would turn
    // the image optimizer into an open proxy for whatever URL gets pasted).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Default is 1MB, which rejects almost any real photo before the
    // storefront image-upload action's own 5MB check even runs.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
