import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted menu photos
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Common Ninja event images
      { protocol: "https", hostname: "cdn.commoninja.com" },
    ],
  },
};

export default nextConfig;
