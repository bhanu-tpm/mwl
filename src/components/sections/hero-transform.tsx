import {
  BookOpenTextIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessageCircleIcon,
  UsersRoundIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/layout/logo";

const today: { label: string; icon: LucideIcon }[] = [
  { label: "Excel sheets", icon: FileSpreadsheetIcon },
  { label: "WhatsApp", icon: MessageCircleIcon },
  { label: "Email threads", icon: MailIcon },
  { label: "Paper files", icon: FileTextIcon },
];

const outcomes: { label: string; icon: LucideIcon }[] = [
  { label: "Automated workflows", icon: WorkflowIcon },
  { label: "Business apps & dashboards", icon: LayoutDashboardIcon },
  { label: "AI knowledge assistant", icon: BookOpenTextIcon },
  { label: "Customer portals", icon: UsersRoundIcon },
];

/** Thin connector lines between the rows; `from`/`to` are x-positions in percent. */
function Connector({ from, to }: { from: number[]; to: number[] }) {
  const lines = from.flatMap((x1) => to.map((x2) => ({ x1, x2 })));
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true">
      {lines.map(({ x1, x2 }) => (
        <line
          key={`${x1}-${x2}`}
          x1={x1}
          y1={0}
          x2={x2}
          y2={40}
          vectorEffect="non-scaling-stroke"
          className="hero-flow stroke-white/25"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      ))}
    </svg>
  );
}

/**
 * Hero visual: everyday tools → Mithila Web Labs → the digital products we build.
 * The same message is stated in the hero copy, so this is decorative for assistive tech.
 */
export function HeroTransform() {
  return (
    <figure className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-[1.375rem] bg-linear-to-b from-white/15 to-white/0"
      />
      <div className="relative rounded-[1.3rem] border border-ink-border bg-[#161615]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
        <p className="eyebrow text-center">How your business runs today</p>
        <ul className="mt-4 grid grid-cols-4 gap-2">
          {today.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 px-1 py-3 text-center text-[0.6875rem] leading-tight text-ink-muted sm:text-xs"
            >
              <Icon aria-hidden="true" className="size-4 opacity-80" />
              {label}
            </li>
          ))}
        </ul>

        <Connector from={[12.5, 37.5, 62.5, 87.5]} to={[50]} />

        <div className="flex justify-center">
          <div className="relative grid size-20 place-items-center rounded-full border border-ink-border bg-ink">
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand/25 blur-xl" />
            <span aria-hidden="true" className="hero-pulse absolute -inset-1.5 rounded-full border border-brand-on-ink/40" />
            <LogoMark className="relative size-14 text-ink-foreground" />
          </div>
        </div>

        <p className="eyebrow mt-4 text-center">What we build for you</p>
        <Connector from={[50]} to={[25, 75]} />

        <ul className="grid grid-cols-2 gap-2.5">
          {outcomes.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-xl border border-ink-border bg-white/[0.06] p-2.5 text-[0.8125rem] leading-snug text-ink-foreground sm:gap-3 sm:p-3 sm:text-sm"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-on-ink">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <figcaption className="sr-only">
          We turn everyday tools like Excel, WhatsApp, email, and paper into automated
          workflows, business applications, AI assistants, and customer portals.
        </figcaption>
      </div>
    </figure>
  );
}
