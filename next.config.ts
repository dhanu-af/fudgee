import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Default is 1MB, which rejects almost any real photo before the
    // storefront image-upload action's own 5MB check even runs.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
