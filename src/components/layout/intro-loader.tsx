import type { CSSProperties } from "react";
import {
  FileSpreadsheetIcon,
  FileTextIcon,
  MailIcon,
  MessageCircleIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * First-visit intro (~1.9s) that tells the company story in one glance:
 *   scattered tools (Excel, WhatsApp, Email, Paper) → connected into a network
 *   → one intelligent system (the neuron fires, "mwl" writes itself) → page reveals.
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

/**
 * Tools start scattered (sx, sy as fractions of the spread distance; sr = tilt) and land on
 * an outer node of the ring (angle in degrees). The stage is 9rem; ring radius ≈ 59.5px.
 */
const tools: { label: string; icon: LucideIcon; sx: number; sy: number; sr: number; angle: number }[] = [
  { label: "Excel", icon: FileSpreadsheetIcon, sx: -1, sy: -0.62, sr: -12, angle: -150 },
  { label: "WhatsApp", icon: MessageCircleIcon, sx: 1, sy: -0.55, sr: 10, angle: -30 },
  { label: "Email", icon: MailIcon, sx: 0.95, sy: 0.62, sr: -8, angle: 30 },
  { label: "Paper", icon: FileTextIcon, sx: -1, sy: 0.58, sr: 14, angle: 150 },
];
const RING_PX = 59.5;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function IntroLoader() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <div className="intro-scene">
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
            {outer.map((p, i) => (
              <rect
                key={`o${i}`}
                x={p.x - 0.8}
                y={p.y - 0.8}
                width={1.6}
                height={1.6}
                rx={0.4}
                className={i === 0 || i === 1 || i === 11 ? "intro-node intro-fire-node" : "intro-node"}
                style={v({ "--i": i })}
              />
            ))}
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

          {tools.map(({ label, icon: Icon, sx, sy, sr, angle }, i) => {
            const a = (angle * Math.PI) / 180;
            return (
              <span
                key={label}
                className="intro-tool"
                style={v({
                  "--sx": sx,
                  "--sy": sy,
                  "--sr": `${sr}deg`,
                  "--ex": `${round(RING_PX * Math.cos(a))}px`,
                  "--ey": `${round(RING_PX * Math.sin(a))}px`,
                  "--i": i,
                })}
              >
                <span className="intro-pill">
                  <Icon className="size-3.5" />
                  {label}
                </span>
              </span>
            );
          })}
        </div>

        <p className="intro-caption">
          <span className="intro-caption-b">
            → one <em>intelligent</em> system
          </span>
        </p>
      </div>
    </div>
  );
}

/** Runs before paint: hide the intro on repeat loads within the same browser session. */
export const introScript = `try{if(sessionStorage.getItem("mwl-intro")){document.documentElement.dataset.intro="seen"}else{sessionStorage.setItem("mwl-intro","1")}}catch(e){}`;
