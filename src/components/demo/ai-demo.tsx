"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  CheckIcon,
  CircleAlertIcon,
  DatabaseIcon,
  FlagIcon,
  InboxIcon,
  LoaderCircleIcon,
  RotateCcwIcon,
  SparklesIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import { demoExamples } from "@/content/demo-examples";
import {
  DEMO_INPUT_MAX,
  DEMO_INPUT_MIN,
  type DemoResponse,
  type DemoResult,
} from "@/lib/validation/demo.schema";
import { cn } from "@/lib/utils";

const stepStyle: Record<DemoResult["workflow"][number]["type"], { icon: LucideIcon; label: string; className: string }> = {
  input: { icon: InboxIcon, label: "Input", className: "border-ink-border bg-white/[0.04]" },
  ai: { icon: BotIcon, label: "AI", className: "border-brand-on-ink/50 bg-brand/15" },
  system: { icon: DatabaseIcon, label: "System", className: "border-ink-border bg-white/[0.04]" },
  human: { icon: UserCheckIcon, label: "Person", className: "border-amber-300/35 bg-amber-300/[0.07]" },
  output: { icon: FlagIcon, label: "Result", className: "border-white/25 bg-ink-foreground text-ink" },
};

const categoryLink: Record<DemoResult["solutionCategory"], { label: string; href: string }> = {
  automation: { label: "AI Business Automation", href: "/solutions#ai-business-automation" },
  "business-app": { label: "Custom Business Applications", href: "/solutions#custom-business-applications" },
  knowledge: { label: "AI Knowledge Systems", href: "/solutions#ai-knowledge-systems" },
  portal: { label: "Customer & Operations Portals", href: "/solutions#customer-operations-portals" },
};

const thinking = ["Reading your process…", "Mapping the workflow…", "Finding where AI helps…", "Checking for human review points…"];

type State =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "done"; input: string; source: "example" | "ai"; result: DemoResult }
  | { phase: "error"; message: string };

export function AiDemo() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });
  const [tick, setTick] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle the "thinking" messages while waiting.
  useEffect(() => {
    if (state.phase !== "loading") return;
    const id = setInterval(() => setTick((t) => t + 1), 1100);
    return () => clearInterval(id);
  }, [state.phase]);

  // Bring the answer into view and move focus to it.
  useEffect(() => {
    if (state.phase === "done" || state.phase === "error") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    }
  }, [state.phase]);

  async function analyse(text: string) {
    const value = text.trim();
    if (value.length < DEMO_INPUT_MIN) {
      setState({ phase: "error", message: `Please describe the process in at least ${DEMO_INPUT_MIN} characters.` });
      return;
    }
    setTick(0);
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/ai-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      const data = (await res.json()) as DemoResponse;
      if (data.status === "ok") setState({ phase: "done", input: value, source: data.source, result: data.result });
      else setState({ phase: "error", message: data.message });
    } catch {
      setState({ phase: "error", message: "We couldn't reach the demo. Check your connection and try again." });
    }
  }

  const loading = state.phase === "loading";

  return (
    <div className="space-y-6">
      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          analyse(input);
        }}
        className="rounded-3xl border border-ink-border bg-[#161615]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6"
      >
        <label htmlFor="demo-input" className="block text-sm font-medium text-ink-foreground">
          How does this process work today?
        </label>
        <textarea
          id="demo-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={DEMO_INPUT_MAX}
          rows={4}
          placeholder="e.g. Our team receives customer orders on WhatsApp and types them into Excel. Customers keep calling to ask for status."
          aria-describedby="demo-hint"
          className="mt-3 w-full resize-none rounded-2xl border border-ink-border bg-black/25 px-4 py-3.5 text-base leading-relaxed text-ink-foreground outline-none placeholder:text-ink-muted/70 focus-visible:border-brand-on-ink/60 focus-visible:ring-3 focus-visible:ring-brand/30"
        />
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="demo-hint" className="text-xs text-ink-muted">
            Please don&apos;t include confidential details · {input.length}/{DEMO_INPUT_MAX}
          </p>
          <Button type="submit" variant="brand" size="lg" disabled={loading} className="w-full sm:w-auto">
            {loading ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : <SparklesIcon data-icon="inline-start" />}
            {loading ? "Analysing…" : "Analyse my process"}
          </Button>
        </div>

        <div className="mt-5 border-t border-ink-border pt-4">
          <p className="text-xs text-ink-muted">Or try an example</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {demoExamples.map((ex) => (
              <button
                key={ex.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  setInput(ex.input);
                  analyse(ex.input);
                }}
                className="rounded-full border border-ink-border bg-ink-surface px-3.5 py-1.5 text-sm text-ink-foreground/85 transition-colors hover:border-white/25 hover:text-ink-foreground disabled:opacity-50"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Answer area */}
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="scroll-mt-24 outline-none">
        {loading && (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-ink-border bg-[#141413] px-6 py-14 text-center">
            <div className="relative grid size-20 place-items-center rounded-2xl border border-white/10 bg-ink">
              <span aria-hidden="true" className="hero-pulse absolute -inset-2 rounded-[1.25rem] border border-brand-on-ink/40" />
              <LogoMark className="size-14" />
            </div>
            <p key={tick} className="ai-step text-sm text-ink-foreground/85">
              {thinking[tick % thinking.length]}
            </p>
          </div>
        )}

        {state.phase === "error" && (
          <div role="alert" className="rounded-3xl border border-amber-300/30 bg-amber-300/[0.06] p-6 sm:p-8">
            <p className="flex items-start gap-3 text-ink-foreground">
              <CircleAlertIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-300" />
              {state.message}
            </p>
            <Button asChild variant="outline-ink" size="lg" className="mt-6">
              <Link href={`/contact${input.trim() ? `?brief=${encodeURIComponent(input.trim().slice(0, DEMO_INPUT_MAX))}` : ""}`}>
                Tell us directly
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        )}

        {state.phase === "done" && !state.result.isBusinessProblem && (
          <div className="rounded-3xl border border-ink-border bg-[#141413] p-6 sm:p-8">
            <p className="text-lg font-medium text-ink-foreground">
              That doesn&apos;t look like a business process we can map yet.
            </p>
            <p className="mt-2 text-ink-muted">
              Try describing something your team does by hand today: where the work arrives, who
              handles it, and what goes wrong. Or pick an example above.
            </p>
          </div>
        )}

        {state.phase === "done" && state.result.isBusinessProblem && (
          <Result result={state.result} source={state.source} input={state.input} onReset={() => {
            setInput("");
            setState({ phase: "idle" });
            document.getElementById("demo-input")?.focus();
          }} />
        )}
      </div>
    </div>
  );
}

function Result({
  result,
  source,
  input,
  onReset,
}: {
  result: DemoResult;
  source: "example" | "ai";
  input: string;
  onReset: () => void;
}) {
  const category = categoryLink[result.solutionCategory];
  const brief = `${input}\n\n(Suggested in the AI demo: ${result.suggestedSolution})`.slice(0, 1200);

  return (
    <article className="overflow-hidden rounded-3xl border border-ink-border bg-[#141413]">
      <header className="ai-step flex flex-wrap items-center justify-between gap-3 border-b border-ink-border px-5 py-4 sm:px-8" style={{ "--d": 0 } as React.CSSProperties}>
        <span className="flex items-center gap-2 text-sm font-medium text-ink-foreground">
          <SparklesIcon aria-hidden="true" className="size-4 text-brand-on-ink" />
          Suggested approach
        </span>
        <span className="rounded-full border border-ink-border px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-ink-muted uppercase">
          {source === "example" ? "Prepared example" : "Generated by AI"}
        </span>
      </header>

      <div className="grid gap-8 p-5 sm:p-8">
        <div className="ai-step grid gap-6 lg:grid-cols-[1fr_1.6fr]" style={{ "--d": 1 } as React.CSSProperties}>
          <div>
            <h2 className="eyebrow">Current problem</h2>
            <p className="mt-2 text-lg text-ink-foreground">{result.problemSummary}</p>
          </div>
          <div>
            <h2 className="eyebrow">Suggested solution</h2>
            <p className="mt-2 text-xl leading-snug font-medium text-ink-foreground sm:text-2xl">
              {result.suggestedSolution}
            </p>
          </div>
        </div>

        <div className="ai-step" style={{ "--d": 2 } as React.CSSProperties}>
          <h2 className="eyebrow">Potential workflow</h2>
          <ol className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
            {result.workflow.map((step, i) => {
              const s = stepStyle[step.type];
              const Icon = s.icon;
              const last = i === result.workflow.length - 1;
              return (
                <li key={`${step.label}-${i}`} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                  <div className={cn("flex flex-1 items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm lg:flex-col lg:items-start lg:gap-2 lg:py-4", s.className)}>
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className="font-medium">{step.label}</span>
                    <span className="ms-auto font-mono text-[0.625rem] tracking-wider uppercase opacity-70 lg:ms-0">{s.label}</span>
                  </div>
                  {!last && (
                    <span aria-hidden="true" className="mx-auto h-3 w-px bg-white/20 lg:mx-0 lg:h-px lg:w-3 lg:shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="ai-step grid gap-4 md:grid-cols-2" style={{ "--d": 3 } as React.CSSProperties}>
          <div className="rounded-2xl border border-ink-border p-5">
            <h2 className="eyebrow">Potential benefits</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-foreground/90">
              {result.benefits.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-border p-5">
            <h2 className="eyebrow">Worth checking</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-foreground/90">
              {result.considerations.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <CircleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ai-step flex flex-col gap-5 border-t border-ink-border pt-6 lg:flex-row lg:items-center lg:justify-between" style={{ "--d": 4 } as React.CSSProperties}>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted">
            {source === "example" ? "Prepared example" : "AI-generated suggestion"} for illustration
            only, not professional consulting advice. A real recommendation starts with
            understanding your process.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href={`/contact?brief=${encodeURIComponent(brief)}`}>
                Discuss this with us
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button type="button" variant="outline-ink" size="lg" onClick={onReset}>
              <RotateCcwIcon data-icon="inline-start" />
              Try another
            </Button>
          </div>
        </div>

        <Link
          href={category.href}
          className="ai-step -mt-2 inline-flex w-fit items-center gap-1.5 text-sm text-brand-on-ink underline-offset-4 hover:underline"
          style={{ "--d": 5 } as React.CSSProperties}
        >
          See how we approach {category.label}
          <ArrowRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
