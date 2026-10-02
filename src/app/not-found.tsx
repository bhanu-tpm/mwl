import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-24 sm:py-32">
          <p className="eyebrow">404</p>
          <h1 className="text-h2 mt-4">This page doesn&apos;t exist yet.</h1>
          <p className="text-lead mt-4 max-w-xl text-muted-foreground">
            The link may be outdated, or the page is still being built.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
