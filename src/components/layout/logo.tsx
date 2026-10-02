import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Placeholder mark: a double-ruled square (a nod to Mithila border work) with a vermilion core. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="var(--brand)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm font-semibold tracking-tight",
        className,
      )}
    >
      <LogoMark />
      <span>{siteConfig.name}</span>
    </Link>
  );
}
