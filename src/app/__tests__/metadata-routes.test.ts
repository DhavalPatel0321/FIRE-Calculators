import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import { PUBLIC_ROUTES, absoluteUrl } from "@/app/seo";
import sitemap from "@/app/sitemap";

describe("metadata routes", () => {
  it("lists every public v1 route in the sitemap", () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((entry) => entry.url);

    expect(urls).toEqual(PUBLIC_ROUTES.map((route) => absoluteUrl(route)));
    expect(sitemapEntries.find((entry) => entry.url === absoluteUrl("/"))).toMatchObject({
      priority: 1,
      changeFrequency: "weekly",
    });
  });

  it("allows indexing and points crawlers at the sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: absoluteUrl("/sitemap.xml"),
      host: "https://fire-calculators.vercel.app",
    });
  });
});
