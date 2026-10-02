import { publicEnv } from "@/lib/env";

/**
 * Company facts used across the site (metadata, footer, JSON-LD).
 * TODO(founder): replace the placeholder contact details before launch.
 */
export const siteConfig = {
  name: "Mithila Web Labs",
  tagline: "AI-Powered Business Applications & Digital Products",
  description:
    "Mithila Web Labs turns business problems into practical digital products, intelligent workflows, and AI-powered applications for growing businesses.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
  locale: "en_IN",
  contact: {
    email: "hello@mithilaweblabs.com",
    whatsapp: null as string | null, // digits only with country code, e.g. "919800000000"
    location: "India",
  },
  social: {
    linkedin: null as string | null,
    github: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
