import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { InkBand } from "@/components/layout/ink-band";

/** Closing call to action used at the bottom of most pages. */
export function CtaBand({
  title = (
    <>
      Have a business process that should be <span className="accent-serif">better?</span>
    </>
  ),
  description = "Tell us how you work today. We’ll help identify what can be digitized, automated, or enhanced with AI.",
  cta = { label: "Start a Conversation", href: "/contact" },
}: {
  title?: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <InkBand glow="center">
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <h2 className="text-display max-w-4xl">{title}</h2>
        <p className="text-lead mt-6 max-w-xl text-ink-muted">{description}</p>
        <Button asChild variant="brand" size="lg" className="mt-10 w-full sm:w-auto">
          <Link href={cta.href}>
            {cta.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </Container>
    </InkBand>
  );
}
