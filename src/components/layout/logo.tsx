import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// Neural net mark: a small "mwl" inside a two-layer network (6 inner, 12 outer nodes).
// Square "pixel" nodes signal digital; the vermilion fan at the top is a neuron firing.
// Geometry is on a 48×48 grid; keep src/app/icon.svg in sync if this changes.
const OUTER_RADIUS = 21.5;
const EDGES =
  "M36.12 17L34.75 5.38M36.12 17L42.62 13.25M36.12 17L45.5 24M36.12 31L45.5 24M36.12 31L42.62 34.75M36.12 31L34.75 42.62M24 38L34.75 42.62M24 38L24 45.5M24 38L13.25 42.62M11.88 31L13.25 42.62M11.88 31L5.38 34.75M11.88 31L2.5 24M11.88 17L2.5 24M11.88 17L5.38 13.25M11.88 17L13.25 5.38";
const INNER_RING = "M24 10L36.12 17V31L24 38L11.88 31V17Z";
const FIRING_EDGES = "M24 10L13.25 5.38M24 10L24 2.5M24 10L34.75 5.38";

type Node = { x: number; y: number; r: number; firing?: boolean; inner?: boolean };
const NODES: Node[] = [
  { x: 24, y: 2.5, r: 1.25, firing: true },
  { x: 34.75, y: 5.38, r: 0.8, firing: true },
  { x: 42.62, y: 13.25, r: 0.8 },
  { x: 45.5, y: 24, r: 0.8 },
  { x: 42.62, y: 34.75, r: 0.8 },
  { x: 34.75, y: 42.62, r: 0.8 },
  { x: 24, y: 45.5, r: 0.8 },
  { x: 13.25, y: 42.62, r: 0.8 },
  { x: 5.38, y: 34.75, r: 0.8 },
  { x: 2.5, y: 24, r: 0.8 },
  { x: 5.38, y: 13.25, r: 0.8 },
  { x: 13.25, y: 5.38, r: 0.8, firing: true },
  { x: 24, y: 10, r: 1.15, firing: true, inner: true },
  { x: 36.12, y: 17, r: 0.85, inner: true },
  { x: 36.12, y: 31, r: 0.85, inner: true },
  { x: 24, y: 38, r: 0.85, inner: true },
  { x: 11.88, y: 31, r: 0.85, inner: true },
  { x: 11.88, y: 17, r: 0.85, inner: true },
];

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
  const accent = tone === "ink" ? "text-brand-on-ink" : "text-brand";

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-11 shrink-0", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="24" cy="24" r={OUTER_RADIUS} opacity="0.22" />
        <path d={EDGES} opacity="0.42" />
        <path d={INNER_RING} opacity="0.28" />
      </g>
      <path
        d={FIRING_EDGES}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        className={accent}
      />
      {NODES.map(({ x, y, r, firing, inner }) => (
        <rect
          key={`${x}-${y}`}
          x={x - r}
          y={y - r}
          width={r * 2}
          height={r * 2}
          rx={r * 0.25}
          fill="currentColor"
          opacity={inner && !firing ? 0.7 : 1}
          className={firing ? accent : undefined}
        />
      ))}
      <path
        d={LETTERS_MWL}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(24 24.4) scale(0.72) translate(-23.9 -23.8)"
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
