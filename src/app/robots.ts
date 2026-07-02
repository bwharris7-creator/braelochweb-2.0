import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio", // hidden admin — never in search results
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
