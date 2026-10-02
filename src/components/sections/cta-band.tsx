import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

/** Closing call to action used at the bottom of most pages. */
export function CtaBand({
  title = "Have a business process that should be better?",
  description = "Tell us how you work today. We’ll help identify what can be digitized, automated, or enhanced with AI.",
  cta = { label: "Start a Conversation", href: "/contact" },
}: {
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <Section tone="deep">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-h2">{title}</h2>
          <p className="text-lead mt-5 text-deep-foreground/75">{description}</p>
        </div>
        <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
          <Link href={cta.href}>
            {cta.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
