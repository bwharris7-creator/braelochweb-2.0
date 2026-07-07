import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // noindex the temporary *.vercel.app URL; the real domain
        // (braelochbrewing.beer) won't match and gets indexed normally.
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Sanity-hosted menu photos
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Common Ninja event images
      { protocol: "https", hostname: "cdn.commoninja.com" },
      // Untappd beer label art
      { protocol: "https", hostname: "labels.untappd.com" },
    ],
  },
};

export default nextConfig;
