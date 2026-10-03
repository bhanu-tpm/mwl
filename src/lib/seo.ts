import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Per-page metadata with a canonical URL. Resolved against `metadataBase` from the root layout. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Page-level openGraph replaces the root one (no deep merge), so repeat the shared fields.
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
