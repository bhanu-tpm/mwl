import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mainNav, primaryCta } from "@/config/nav";
import { Container } from "./container";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks items={mainNav} className="flex items-center gap-8 text-sm" />
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="lg" className="hidden sm:inline-flex h-10">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
