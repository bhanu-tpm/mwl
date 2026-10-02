import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

// Phase 1: hero only, to review the visual foundation. Remaining sections arrive in Phase 2.
export default function HomePage() {
  return (
    <section className="border-b">
      <Container className="py-20 sm:py-28 lg:py-36">
        <p className="eyebrow">Product engineering · AI · Automation</p>
        <h1 className="text-display mt-6 max-w-4xl">
          AI-Powered Business Applications{" "}
          <span className="text-muted-foreground">&amp; Digital Products</span>
        </h1>
        <p className="text-lead mt-6 max-w-2xl text-muted-foreground">
          We turn business problems into practical digital products, intelligent
          workflows, and AI-powered applications.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="lg">
            <Link href="/contact">
              Discuss Your Business Problem
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">Explore Our Work</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
