import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// "Woven ring": 12 points on a circle, each joined to the point three steps on, forming a
// fine interlaced net around a small "mwl". One vermilion node (top) is the brand accent.
// Geometry is on a 48×48 grid; keep src/app/icon.svg in sync if this changes.
const RING_RADIUS = 21.5;
const NET_CHORDS =
  "M24 2.5L45.5 24M34.75 5.38L42.62 34.75M42.62 13.25L34.75 42.62M45.5 24L24 45.5M42.62 34.75L13.25 42.62M34.75 42.62L5.38 34.75M24 45.5L2.5 24M13.25 42.62L5.38 13.25M5.38 34.75L13.25 5.38M2.5 24L24 2.5M5.38 13.25L34.75 5.38M13.25 5.38L42.62 13.25";
const NET_NODES: [number, number][] = [
  [34.75, 5.38], [42.62, 13.25], [45.5, 24], [42.62, 34.75], [34.75, 42.62],
  [24, 45.5], [13.25, 42.62], [5.38, 34.75], [2.5, 24], [5.38, 13.25], [13.25, 5.38],
];
const ACCENT_NODE: [number, number] = [24, 2.5];
const LETTERS_MWL =
  "M14.7 28.4V23.6a1.9 1.9 0 0 1 3.8 0V28.4M18.5 23.6a1.9 1.9 0 0 1 3.8 0V28.4M23.9 22l1.7 6.4 1.7-4.7 1.7 4.7 1.7-6.4M33.1 19.2V28.4";

export function LogoMark({
  className,
  tone = "ink",
}: {
  className?: string;
  /** Background the mark sits on; picks an accessible accent colour. */
  tone?: "ink" | "light";
}) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-11 shrink-0", className)}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r={RING_RADIUS} strokeWidth="0.55" opacity="0.35" />
        <path d={NET_CHORDS} strokeWidth="0.55" opacity="0.5" />
        <path
          d={LETTERS_MWL}
          strokeWidth="1.9"
          transform="translate(24 24) scale(0.78) translate(-23.9 -23.8)"
        />
      </g>
      <g fill="currentColor">
        {NET_NODES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.8" />
        ))}
      </g>
      <circle
        cx={ACCENT_NODE[0]}
        cy={ACCENT_NODE[1]}
        r="1.35"
        className={tone === "ink" ? "fill-brand-on-ink" : "fill-brand"}
      />
    </svg>
  );
}

export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center gap-3 rounded-sm font-semibold tracking-tight",
        className,
      )}
    >
      <LogoMark tone={tone} />
      <span>{siteConfig.name}</span>
    </Link>
  );
}
