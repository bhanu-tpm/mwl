import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { Logo } from "./logo";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="border-t border-ink-border bg-ink text-ink-foreground">
      <Container className="grid gap-14 pt-20 pb-14 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            {siteConfig.description}
          </p>
          <address className="mt-8 space-y-2 text-sm not-italic">
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex items-center gap-1.5 rounded-sm text-ink-foreground"
            >
              {contact.email}
              <ArrowUpRightIcon aria-hidden="true" className="size-3.5 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                className="block w-fit rounded-sm text-ink-foreground hover:underline underline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            )}
            <span className="block text-ink-muted">{contact.location}</span>
          </address>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="eyebrow">{group.title}</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-ink-muted transition-colors hover:text-ink-foreground"
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

      <Container aria-hidden="true" className="overflow-hidden">
        <p className="select-none whitespace-nowrap text-[clamp(2.5rem,10.5vw,8rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-white/[0.05]">
          Mithila Web Labs
        </p>
      </Container>

      <div className="border-t border-ink-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="font-mono">Designed &amp; engineered in-house</p>
        </Container>
      </div>
    </footer>
  );
}
