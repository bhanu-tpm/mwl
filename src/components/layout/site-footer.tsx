import Link from "next/link";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { Logo } from "./logo";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="border-t bg-background">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic">
            <a
              href={`mailto:${contact.email}`}
              className="block w-fit rounded-sm underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                className="block w-fit rounded-sm underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            )}
            <span className="block text-muted-foreground">{contact.location}</span>
          </address>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="eyebrow">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>

      <div className="border-t">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="font-mono">Built with Next.js · Designed &amp; engineered in-house</p>
        </Container>
      </div>
    </footer>
  );
}
