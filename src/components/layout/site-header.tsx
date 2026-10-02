import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mainNav, primaryCta } from "@/config/nav";
import { Container } from "./container";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink text-ink-foreground">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks
            items={mainNav}
            className="flex items-center gap-1 text-sm"
            linkClassName="rounded-full px-3.5 py-2 text-ink-muted hover:text-ink-foreground hover:bg-ink-surface aria-[current=page]:text-ink-foreground aria-[current=page]:bg-ink-surface"
          />
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="brand" className="hidden h-9 rounded-full px-4 sm:inline-flex">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
