"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
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
    <div className="card-elevated p-8">
      <h1 className="text-xl font-semibold tracking-tight">Something went wrong loading this page.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        If the database was just restarted, try again in a few seconds.
      </p>
      <Button className="mt-6" onClick={() => retry()}>
        <RotateCcwIcon data-icon="inline-start" />
        Try again
      </Button>
      {error.digest && <p className="mt-6 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </div>
  );
}
