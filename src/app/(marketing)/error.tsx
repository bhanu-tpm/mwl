"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

export default function MarketingError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 sm:py-32">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="text-h2 mt-4">This page didn&apos;t load properly.</h1>
      <p className="text-lead mt-4 max-w-xl text-muted-foreground">
        It&apos;s on our side, not yours. Try again, or reach us directly at{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-foreground underline underline-offset-4">
          {siteConfig.contact.email}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => retry()}>
          <RotateCcwIcon data-icon="inline-start" />
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      {error.digest && <p className="mt-8 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </Container>
  );
}
