import { siteConfig } from "@/config/site";
import type { Solution } from "@/content/solutions";

/**
 * Structured data (schema.org) for search engines. Rendered as a JSON script tag; `<` is escaped
 * so user-controlled text can never close the tag (Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${siteConfig.url}/#organization`;

export function organizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    areaServed: ["IN", "AE"],
    knowsAbout: [
      "AI business automation",
      "Custom business software",
      "AI knowledge assistants",
      "Customer portals",
      "Digital product development",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": orgId },
  };
}

export function servicesJsonLd(solutions: Solution[]) {
  return solutions.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    serviceType: s.title,
    url: `${siteConfig.url}/solutions#${s.id}`,
    provider: { "@id": orgId },
    areaServed: ["IN", "AE"],
  }));
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
