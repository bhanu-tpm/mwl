import { cn } from "@/lib/utils";

/**
 * Dark "ink" band with a faint grid and a single soft vermilion glow.
 * Used for the hero, inner-page intros, and the closing CTA.
 */
export function InkBand({
  as: Tag = "section",
  glow = "end",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
  glow?: "end" | "center" | "none";
}) {
  return (
    <Tag
      className={cn("relative isolate overflow-hidden bg-ink text-ink-foreground", className)}
      {...props}
    >
      <div aria-hidden="true" className="bg-grid-ink pointer-events-none absolute inset-0 -z-10" />
      {glow !== "none" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -z-10 size-[44rem] rounded-full bg-brand/20 blur-[140px]",
            glow === "end" ? "-top-80 -end-40" : "-top-96 left-1/2 -translate-x-1/2",
          )}
        />
      )}
      {children}
    </Tag>
  );
}
