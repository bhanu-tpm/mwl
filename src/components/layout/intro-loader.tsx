import type { CSSProperties } from "react";
import {
  BookOpenTextIcon,
  LayoutDashboardIcon,
  UsersRoundIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * First-visit intro (~1.8s) that says what we build before the visitor reads anything:
 *   the neural net draws → our four capabilities light up as parts of it
 *   → the core neuron fires, "mwl" writes itself → positioning line → page reveals.
 *
 * Pure HTML/SVG + CSS (see `.intro*` in globals.css): no client JS, so it can never get stuck.
 * Skipped on repeat loads in the same session (`introScript`) and for reduced motion.
 */

const C = 24;
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: round(C + r * Math.cos(a)), y: round(C + r * Math.sin(a)) };
};

const outer = Array.from({ length: 12 }, (_, i) => polar(21.5, -90 + i * 30));
const inner = Array.from({ length: 6 }, (_, j) => polar(14, -90 + j * 60));
// Each inner node fans out to the three nearest outer nodes; inner node 0 (top) "fires".
const edges = inner.flatMap((p, j) =>
  [-1, 0, 1].map((k) => ({ from: p, to: outer[(2 * j + k + 12) % 12], firing: j === 0, j })),
);

const LETTERS_MWL =
  "M14.7 28.4V23.6a1.9 1.9 0 0 1 3.8 0V28.4M18.5 23.6a1.9 1.9 0 0 1 3.8 0V28.4M23.9 22l1.7 6.4 1.7-4.7 1.7 4.7 1.7-6.4M33.1 19.2V28.4";

// Stage is 9rem (144px); the mark's ring radius is ≈ 59.5px. Pill positions are px from centre.
const RING_PX = 59.5;
const capabilities: { label: string; icon: LucideIcon; node: number; x: number; y: number }[] = [
  { label: "AI Automation", icon: WorkflowIcon, node: 10, x: -74, y: -104 },
  { label: "Business Apps", icon: LayoutDashboardIcon, node: 2, x: 74, y: -104 },
  { label: "Customer Portals", icon: UsersRoundIcon, node: 4, x: 74, y: 104 },
  { label: "Knowledge AI", icon: BookOpenTextIcon, node: 8, x: -74, y: 104 },
];
const nodePx = (i: number) => {
  const a = ((-90 + i * 30) * Math.PI) / 180;
  return { x: round(RING_PX * Math.cos(a)), y: round(RING_PX * Math.sin(a)) };
};
const capabilityNodes = new Map(capabilities.map((c, order) => [c.node, order]));

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function IntroLoader() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <div className="intro-scene">
          {/* Connectors from each capability to its node, in px around the centre. */}
          <svg viewBox="-160 -130 320 260" className="intro-links">
            {capabilities.map(({ label, node, x, y }, order) => {
              const n = nodePx(node);
              return (
                <path
                  key={label}
                  d={`M${x * 0.86} ${y - Math.sign(y) * 14}L${n.x} ${n.y}`}
                  pathLength={1}
                  className="intro-link"
                  style={v({ "--c": order })}
                />
              );
            })}
          </svg>

          <svg viewBox="-2 -2 52 52" className="intro-mark">
            <circle cx="24" cy="24" r="21.5" pathLength={1} className="intro-draw intro-ring" />
            <path
              d={`M${inner.map((p) => `${p.x} ${p.y}`).join("L")}Z`}
              pathLength={1}
              className="intro-draw intro-hex"
            />
            {edges.map(({ from, to, firing, j }, i) => (
              <path
                key={i}
                d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
                pathLength={1}
                className={firing ? "intro-draw intro-edge intro-fire" : "intro-draw intro-edge"}
                style={v({ "--i": j })}
              />
            ))}
            {outer.map((p, i) => {
              const order = capabilityNodes.get(i);
              const firing = i === 0 || i === 1 || i === 11;
              return (
                <rect
                  key={`o${i}`}
                  x={p.x - 0.8}
                  y={p.y - 0.8}
                  width={1.6}
                  height={1.6}
                  rx={0.4}
                  className={
                    firing
                      ? "intro-node intro-fire-node"
                      : order !== undefined
                        ? "intro-node intro-cap-node"
                        : "intro-node"
                  }
                  style={v({ "--i": i, "--c": order ?? 0 })}
                />
              );
            })}
            {inner.map((p, j) => (
              <rect
                key={`i${j}`}
                x={p.x - 0.85}
                y={p.y - 0.85}
                width={1.7}
                height={1.7}
                rx={0.4}
                className={j === 0 ? "intro-node intro-fire-node" : "intro-node intro-node-inner"}
                style={v({ "--i": j * 2 })}
              />
            ))}
            <circle cx={inner[0].x} cy={inner[0].y} r="2" className="intro-pulse" />
            <path
              d={LETTERS_MWL}
              pathLength={1}
              className="intro-draw intro-letters"
              transform="translate(24 24.4) scale(0.72) translate(-23.9 -23.8)"
            />
          </svg>

          {capabilities.map(({ label, icon: Icon, x, y }, order) => (
            <span
              key={label}
              className="intro-cap"
              style={v({ "--x": `${x}px`, "--y": `${y}px`, "--c": order })}
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>

        <p className="intro-caption">
          AI-Powered Business Applications <em>&amp; Digital Products</em>
        </p>
      </div>
    </div>
  );
}

/** Runs before paint: hide the intro on repeat loads within the same browser session. */
export const introScript = `try{if(sessionStorage.getItem("mwl-intro")){document.documentElement.dataset.intro="seen"}else{sessionStorage.setItem("mwl-intro","1")}}catch(e){}`;
