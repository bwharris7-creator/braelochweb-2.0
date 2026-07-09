import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Old Squarespace URLs → new structure (permanent, for links + Google)
    const map: Record<string, string> = {
      "/lets-eat": "/food",
      "/lets-drink": "/beer",
      "/tap": "/beer",
      "/where": "/beer",
      "/calendar": "/events",
      "/event-form": "/private-events",
      "/private-events-1": "/private-events",
      "/building-history": "/about",
      "/brewhouse": "/about",
      "/3d-tour": "/about",
      "/gallery": "/about",
      "/contact": "/visit",
    };
    return Object.entries(map).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
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
