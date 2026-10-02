"use client";

import { useRef, useState } from "react";
import {
  ArrowDownIcon,
  BotIcon,
  CheckIcon,
  CircleAlertIcon,
  InboxIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCheckIcon,
  UsersRoundIcon,
} from "lucide-react";
import { REVIEW_THRESHOLD, aiScenarios } from "@/content/ai-scenarios";
import { cn } from "@/lib/utils";

/**
 * Industry tabs + an illustrative AI run: input → AI extraction (with confidence)
 * → automatic checks → human review of exceptions → result.
 * Steps re-animate on every tab change (the run is keyed by scenario id).
 */
export function AiInPractice() {
  const [active, setActive] = useState(aiScenarios[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = aiScenarios.find((s) => s.id === active) ?? aiScenarios[0];

  // Tablist keyboard support: arrows move between industries.
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + aiScenarios.length) % aiScenarios.length;
    setActive(aiScenarios[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Industry tabs */}
      <div
        role="tablist"
        aria-label="Industries"
        aria-orientation="vertical"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {aiScenarios.map((s, i) => {
          const Icon = s.icon;
          const on = s.id === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`ai-tab-${s.id}`}
              aria-selected={on}
              aria-controls="ai-run"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors lg:px-5 lg:py-4",
                on
                  ? "border-white/20 bg-white/[0.08] text-ink-foreground"
                  : "border-ink-border text-ink-muted hover:border-white/15 hover:text-ink-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                  on ? "bg-brand text-brand-foreground" : "bg-ink-surface",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium whitespace-nowrap">{s.industry}</span>
                <span className="hidden text-xs text-ink-muted lg:block">{s.process}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Illustrative run */}
      <div
        id="ai-run"
        role="tabpanel"
        aria-labelledby={`ai-tab-${scenario.id}`}
        className="rounded-3xl border border-ink-border bg-[#141413] p-4 sm:p-6"
      >
        <div key={scenario.id} className="grid gap-3">
          <div className="ai-step flex flex-wrap items-center justify-between gap-2 px-1" style={{ "--d": 0 } as React.CSSProperties}>
            <p className="text-sm font-medium text-ink-foreground">{scenario.process}</p>
            <span className="rounded-full border border-ink-border px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-ink-muted uppercase">
              Illustrative run
            </span>
          </div>

          {/* 1 · Input */}
          <Step n={1} icon={InboxIcon} label="Comes in" meta={scenario.input.channel} delay={1}>
            <p className="rounded-xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-ink-foreground/90">
              {scenario.input.content}
            </p>
          </Step>

          {/* 2 · AI extracts */}
          <Step n={2} icon={BotIcon} label="AI reads & extracts" accent delay={2}>
            <dl className="divide-y divide-white/5 overflow-hidden rounded-xl border border-ink-border">
              {scenario.extracted.map((f) => {
                const low = f.confidence < REVIEW_THRESHOLD;
                return (
                  <div key={f.field} className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-3.5 py-2.5 text-sm sm:grid-cols-[9rem_1fr_auto]">
                    <dt className="col-start-1 text-xs text-ink-muted sm:text-sm">{f.field}</dt>
                    <dd className="col-start-1 min-w-0 text-ink-foreground sm:col-start-2 sm:row-start-1">{f.value}</dd>
                    <dd className="col-start-2 row-span-2 row-start-1 flex items-center gap-2 sm:col-start-3 sm:row-span-1">
                      <span className="hidden h-1 w-14 overflow-hidden rounded-full bg-white/10 sm:block" aria-hidden="true">
                        <span
                          className={cn("block h-full rounded-full", low ? "bg-amber-300" : "bg-emerald-300")}
                          style={{ width: `${f.confidence}%` }}
                        />
                      </span>
                      <span className={cn("font-mono text-xs tabular-nums", low ? "text-amber-300" : "text-emerald-300")}>
                        {f.confidence}%
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-2 px-1 text-xs text-ink-muted">
              Below {REVIEW_THRESHOLD}% confidence → a person checks it.
            </p>
          </Step>

          {/* 3 · Checks */}
          <Step n={3} icon={ShieldCheckIcon} label="Automatic checks" delay={3}>
            <ul className="flex flex-wrap gap-2">
              {scenario.checks.map((c) => (
                <li
                  key={c.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs",
                    c.ok ? "border-emerald-300/25 text-emerald-200" : "border-amber-300/40 bg-amber-300/10 text-amber-200",
                  )}
                >
                  {c.ok ? <CheckIcon aria-hidden="true" className="size-3.5" /> : <CircleAlertIcon aria-hidden="true" className="size-3.5" />}
                  {c.label}
                  <span className="sr-only">{c.ok ? "passed" : "flagged"}</span>
                </li>
              ))}
            </ul>
          </Step>

          {/* 4 · Human in the loop */}
          <Step n={4} icon={UserCheckIcon} label="A person decides" meta={scenario.review.who} delay={4}>
            <div className="flex flex-col gap-1 rounded-xl border border-amber-300/25 bg-amber-300/[0.06] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-ink-foreground/90">{scenario.review.reason}</span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-emerald-200">
                <CheckIcon aria-hidden="true" className="size-4" />
                {scenario.review.decision}
              </span>
            </div>
          </Step>

          {/* 5 · Result */}
          <Step n={5} icon={SparklesIcon} label="Done" delay={5} last>
            <ul className="grid gap-2 sm:grid-cols-3">
              {scenario.result.map((r) => (
                <li key={r} className="flex items-start gap-2 rounded-xl bg-brand/12 px-3 py-2.5 text-sm text-ink-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-on-ink" />
                  {r}
                </li>
              ))}
            </ul>
          </Step>

          {/* Who does what */}
          <div className="ai-step mt-2 grid gap-3 sm:grid-cols-2" style={{ "--d": 6 } as React.CSSProperties}>
            <Split icon={BotIcon} title="AI does" items={scenario.aiDoes} />
            <Split icon={UsersRoundIcon} title="Your team does" items={scenario.teamDoes} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  label,
  meta,
  accent,
  delay,
  last,
  children,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  label: string;
  meta?: string;
  accent?: boolean;
  delay: number;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="ai-step grid grid-cols-[2rem_1fr] gap-3" style={{ "--d": delay } as React.CSSProperties}>
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-full border text-xs",
            accent ? "border-brand bg-brand text-brand-foreground" : "border-ink-border bg-ink text-ink-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
        {!last && (
          <span aria-hidden="true" className="mt-1 flex flex-1 flex-col items-center text-white/20">
            <span className="w-px flex-1 bg-white/10" />
            <ArrowDownIcon className="size-3" />
          </span>
        )}
      </div>
      <div className="min-w-0 pb-1">
        <h3 className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-mono text-[0.6875rem] text-ink-muted">0{n}</span>
          <span className="font-medium text-ink-foreground">{label}</span>
          {meta && <span className="text-xs text-ink-muted">· {meta}</span>}
        </h3>
        <div className="mt-2.5">{children}</div>
      </div>
    </section>
  );
}

function Split({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-ink-border p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-ink-foreground">
        <Icon aria-hidden="true" className="size-4 text-brand-on-ink" />
        {title}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-white/30" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
