import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// "mwl" caught in a web: 12 spokes, three sagging threads, vermilion nodes on the outer ring.
// Geometry generated on a 48×48 grid; keep src/app/icon.svg in sync if this changes.
const WEB_THREADS = [
  "M27.83 9.7Q30.66 12.46 34.47 13.53Q35.54 17.34 38.3 20.17Q37.32 24 38.3 27.83Q35.54 30.66 34.47 34.47Q30.66 35.54 27.83 38.3Q24 37.32 20.17 38.3Q17.34 35.54 13.53 34.47Q12.46 30.66 9.7 27.83Q10.68 24 9.7 20.17Q12.46 17.34 13.53 13.53Q17.34 12.46 20.17 9.7Q24 10.68 27.83 9.7Z",
  "M28.89 5.74Q32.5 9.27 37.36 10.64Q38.73 15.5 42.26 19.11Q41.01 24 42.26 28.89Q38.73 32.5 37.36 37.36Q32.51 38.73 28.89 42.26Q24 41.01 19.11 42.26Q15.49 38.73 10.64 37.36Q9.27 32.51 5.74 28.89Q6.99 24 5.74 19.11Q9.27 15.49 10.64 10.64Q15.5 9.27 19.11 5.74Q24 6.99 28.89 5.74Z",
  "M29.9 1.98Q34.26 6.23 40.12 7.88Q41.77 13.74 46.02 18.1Q44.52 24 46.02 29.9Q41.77 34.26 40.12 40.12Q34.26 41.77 29.9 46.02Q24 44.52 18.1 46.02Q13.74 41.77 7.88 40.12Q6.23 34.26 1.98 29.9Q3.48 24 1.98 18.1Q6.23 13.74 7.88 7.88Q13.74 6.23 18.1 1.98Q24 3.48 29.9 1.98Z",
];
const WEB_SPOKES =
  "M27.42 11.25L29.9 1.98M33.33 14.67L40.12 7.88M36.75 20.58L46.02 18.1M36.75 27.42L46.02 29.9M33.33 33.33L40.12 40.12M27.42 36.75L29.9 46.02M20.58 36.75L18.1 46.02M14.67 33.33L7.88 40.12M11.25 27.42L1.98 29.9M11.25 20.58L1.98 18.1M14.67 14.67L7.88 7.88M20.58 11.25L18.1 1.98";
const WEB_NODES: [number, number][] = [
  [29.9, 1.98], [40.12, 7.88], [46.02, 18.1], [46.02, 29.9], [40.12, 40.12], [29.9, 46.02],
  [18.1, 46.02], [7.88, 40.12], [1.98, 29.9], [1.98, 18.1], [7.88, 7.88], [18.1, 1.98],
];
const LETTERS_MWL =
  "M14.7 28.4V23.6a1.9 1.9 0 0 1 3.8 0V28.4M18.5 23.6a1.9 1.9 0 0 1 3.8 0V28.4M23.9 22l1.7 6.4 1.7-4.7 1.7 4.7 1.7-6.4M33.1 19.2V28.4";

export function LogoMark({
  className,
  tone = "ink",
}: {
  className?: string;
  /** Background the mark sits on; picks an accessible node colour. */
  tone?: "ink" | "light";
}) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-11 shrink-0", className)}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g strokeWidth="0.75" opacity="0.45">
          {WEB_THREADS.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={WEB_SPOKES} />
        </g>
        <path d={LETTERS_MWL} strokeWidth="1.85" transform="translate(24 24) scale(1.12) translate(-24 -24)" />
      </g>
      <g className={tone === "ink" ? "fill-brand-on-ink" : "fill-brand"}>
        {WEB_NODES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" />
        ))}
      </g>
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
