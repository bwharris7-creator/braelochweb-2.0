import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/beer", "/food", "/events", "/about", "/visit"];
  return pages.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/events" || path === "/beer" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
