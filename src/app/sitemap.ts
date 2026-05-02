import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, absoluteUrl } from "@/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date("2026-05-02"),
    changeFrequency:
      route === "/" || route === "/plan" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/plan" ? 0.9 : 0.7,
  }));
}
