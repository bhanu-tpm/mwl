import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Public, indexable pages only. Portfolio and case studies join once they have real content.
const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ai-demo", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-we-work", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));
}
