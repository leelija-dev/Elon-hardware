export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllProducts, getRanges } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => new URL(p, site.url).toString();
  const pages = ["/", "/about", "/products", "/contact", "/enquiry", "/services", "/downloads", "/locker-finder"].map((p) => ({
    url: u(p),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));
  const ranges = getRanges();
  const listing = ranges.flatMap((r) => [
    { url: u(`/products/${r.slug}`), changeFrequency: "weekly" as const, priority: 0.8 },
    ...r.categories.map((c) => ({ url: u(`/products/${r.slug}/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
  ]);
  const products = getAllProducts().map((p) => ({ url: u(p.href), lastModified: p.addedOn, priority: 0.6 }));
  return [...pages, ...listing, ...products];
}
