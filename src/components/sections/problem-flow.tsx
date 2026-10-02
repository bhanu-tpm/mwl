import { LogoMark } from "@/components/layout/logo";

/**
 * Live "problems in → solutions out" flow (inspired by data-flow hero visuals).
 * Vermilion problems travel along curves into the mwl core; each re-emerges on the other side
 * as its matching outcome. Pure SVG/SMIL — no client JS. Horizontal on md+, vertical on phones.
 * Reduced motion: moving layers are hidden and static labels are shown instead (globals.css).
 */

const pairs: [problem: string, outcome: string][] = [
  ["Excel chaos", "One live system"],
  ["Retyping data", "Automated entry"],
  ["WhatsApp orders", "Tracked orders"],
  ["Stuck approvals", "One-tap approvals"],
  ["Scattered files", "Instant answers"],
  ["Month-end reports", "Live dashboards"],
  ["“Where’s my order?”", "Self-serve status"],
];

const DUR = 10; // seconds per tag cycle (travel + rest)
const N = pairs.length;

type Pt = { x: number; y: number };
type Orientation = "horizontal" | "vertical";

/** Geometry in "flow space": `along` runs input → output, `across` spreads the lanes. */
function geometry(orientation: Orientation) {
  const L = orientation === "horizontal" ? 1200 : 560; // along
  const A = orientation === "horizontal" ? 440 : 400; // across
  const map = (along: number, across: number): Pt =>
    orientation === "horizontal" ? { x: along, y: across } : { x: across, y: along };
  const mid = L / 2;
  const gap = orientation === "horizontal" ? 58 : 52; // keeps lines off the core

  const lanes = pairs.map((_, i) => {
    const across = A * (0.07 + (0.86 * i) / (N - 1));
    const settle = A / 2 + (across - A / 2) * 0.06;
    const bend = A / 2 + (across - A / 2) * 0.4;
    // Input side: edge → core
    const inPts = [map(0, across), map(L * 0.24, across), map(mid - L * 0.14, bend), map(mid - gap, settle)];
    // Output side: core → edge
    const outPts = [map(mid + gap, settle), map(mid + L * 0.14, bend), map(L * 0.76, across), map(L, across)];
    return { inPts, outPts };
  });

  const width = orientation === "horizontal" ? L : A;
  const height = orientation === "horizontal" ? A : L;
  return { lanes, width, height };
}

const d = ([p0, p1, p2, p3]: Pt[]) =>
  `M${p0.x} ${p0.y}C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

/** Point on a cubic bezier, for static (reduced-motion) label positions. */
function at([p0, p1, p2, p3]: Pt[], t: number): Pt {
  const u = 1 - t;
  const f = (a: number, b: number, c: number, e: number) =>
    u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * e;
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
// Each tag is on screen for TRAVEL of every DUR-second cycle, so only ~3 per side show at once.
// Consecutive tags use lanes far apart (ORDER) to avoid overlaps. Negative begins start the
// scene already in motion; an outcome emerges as its problem reaches the core.
const TRAVEL = 0.45;
const ORDER = [0, 3, 6, 2, 5, 1, 4];
const problemBegin = (i: number) => -mod(ORDER.indexOf(i) * (DUR / N), DUR);
const outcomeBegin = (i: number) => -mod(-(problemBegin(i) + DUR * TRAVEL * 0.92), DUR);

function Tag({ label, tone }: { label: string; tone: "problem" | "outcome" }) {
  const w = Math.round(label.length * 6.7 + 26);
  return (
    <g>
      <rect
        x={-w / 2}
        y={-13}
        width={w}
        height={26}
        rx={13}
        className={tone === "problem" ? "flow-tag-problem" : "flow-tag-outcome"}
      />
      <text textAnchor="middle" dominantBaseline="central" className="flow-tag-text">
        {tone === "outcome" ? `✓ ${label}` : label}
      </text>
    </g>
  );
}

function Flow({ orientation, className }: { orientation: Orientation; className?: string }) {
  const { lanes, width, height } = geometry(orientation);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <defs>
        {lanes.map((lane, i) => (
          <g key={i}>
            <path id={`flow-${orientation}-in-${i}`} d={d(lane.inPts)} />
            <path id={`flow-${orientation}-out-${i}`} d={d(lane.outPts)} />
          </g>
        ))}
      </defs>

      {/* Lanes */}
      {lanes.map((lane, i) => (
        <g key={i} fill="none">
          <path d={d(lane.inPts)} className="flow-lane-in" />
          <path d={d(lane.outPts)} className="flow-lane-out" />
        </g>
      ))}

      {/* Moving dots */}
      <g className="flow-motion">
        {lanes.map((_, i) =>
          [0, 0.5].map((offset) => (
            <g key={`${i}-${offset}`}>
              <circle r={3.5} className="flow-dot-in">
                <animateMotion dur={`${DUR * 0.6}s`} begin={`${-((i * 0.37 + offset) * DUR * 0.6).toFixed(2)}s`} repeatCount="indefinite">
                  <mpath href={`#flow-${orientation}-in-${i}`} />
                </animateMotion>
              </circle>
              <circle r={3} className="flow-dot-out">
                <animateMotion dur={`${DUR * 0.6}s`} begin={`${-((i * 0.29 + offset) * DUR * 0.6).toFixed(2)}s`} repeatCount="indefinite">
                  <mpath href={`#flow-${orientation}-out-${i}`} />
                </animateMotion>
              </circle>
            </g>
          )),
        )}

        {/* Problem tags travel in and fade into the core… */}
        {pairs.map(([problem], i) => (
          <g key={`p${i}`} opacity={0}>
            <Tag label={problem} tone="problem" />
            <animateMotion dur={`${DUR}s`} begin={`${problemBegin(i).toFixed(2)}s`} repeatCount="indefinite" keyPoints="0.1;0.9;0.9" keyTimes={`0;${TRAVEL};1`} calcMode="linear">
              <mpath href={`#flow-${orientation}-in-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${DUR}s`} begin={`${problemBegin(i).toFixed(2)}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes={`0;0.05;${TRAVEL * 0.8};${TRAVEL * 0.94};1`} />
          </g>
        ))}

        {/* …and re-emerge as their outcome. */}
        {pairs.map(([, outcome], i) => (
          <g key={`o${i}`} opacity={0}>
            <Tag label={outcome} tone="outcome" />
            <animateMotion dur={`${DUR}s`} begin={`${outcomeBegin(i).toFixed(2)}s`} repeatCount="indefinite" keyPoints="0.12;0.9;0.9" keyTimes={`0;${TRAVEL};1`} calcMode="linear">
              <mpath href={`#flow-${orientation}-out-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${DUR}s`} begin={`${outcomeBegin(i).toFixed(2)}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes={`0;0.05;${TRAVEL * 0.82};${TRAVEL};1`} />
          </g>
        ))}
      </g>

      {/* Reduced motion: a still picture with a few labels in place. */}
      <g className="flow-static">
        {lanes.map((lane, i) =>
          i % 2 === 0 ? (
            <g key={i}>
              <g transform={`translate(${at(lane.inPts, 0.45).x} ${at(lane.inPts, 0.45).y})`}>
                <Tag label={pairs[i][0]} tone="problem" />
              </g>
              <g transform={`translate(${at(lane.outPts, 0.55).x} ${at(lane.outPts, 0.55).y})`}>
                <Tag label={pairs[i][1]} tone="outcome" />
              </g>
            </g>
          ) : null,
        )}
      </g>
    </svg>
  );
}

export function ProblemFlow() {
  return (
    <figure className="relative isolate overflow-hidden rounded-3xl bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid-ink pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]"
      />

      <div className="flex justify-between px-5 pt-5 font-mono text-[0.6875rem] tracking-wider uppercase sm:px-7 sm:pt-6">
        <span className="text-brand-on-ink">Your business today</span>
        <span className="hidden text-ink-muted md:inline">With Mithila Web Labs</span>
      </div>

      <div className="relative">
        <Flow orientation="horizontal" className="hidden w-full md:block" />
        <Flow orientation="vertical" className="mx-auto block w-full max-w-md md:hidden" />

        {/* Core */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid size-20 place-items-center rounded-2xl border border-white/15 bg-[#1a1a19] shadow-2xl shadow-black/50 sm:size-24">
            <span aria-hidden="true" className="hero-pulse absolute -inset-2 rounded-[1.25rem] border border-brand-on-ink/40" />
            <LogoMark className="size-14 sm:size-16" />
          </div>
        </div>
      </div>

      <p className="px-5 pb-5 text-center font-mono text-[0.6875rem] tracking-wider text-ink-muted uppercase md:hidden">
        With Mithila Web Labs
      </p>

      <figcaption className="sr-only">
        Common problems such as Excel chaos, retyping data, WhatsApp orders, stuck approvals,
        scattered files, month-end reports, and status calls flow into Mithila Web Labs and come out
        as one live system, automated entry, tracked orders, one-tap approvals, instant answers,
        live dashboards, and self-serve status.
      </figcaption>
    </figure>
  );
}
