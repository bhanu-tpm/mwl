"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { businessProblems } from "@/content/problems";
import { cn } from "@/lib/utils";

/**
 * "Which of these sound familiar?" Visitors tap the problems they have; each reveals how we
 * fix it, and the selection flows into the contact form (?problems=…).
 */
export function ProblemPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only show the mobile action bar while this section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const count = selected.length;
  const href = count ? `/contact?problems=${selected.join(",")}` : "/contact";

  return (
    <div ref={ref}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businessProblems.map(({ id, title, description, fix, icon: Icon }) => {
          const on = selected.includes(id);
          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(id)}
                className={cn(
                  "card-elevated group flex h-full w-full flex-col p-5 text-start transition-[box-shadow,transform] sm:p-6",
                  on ? "ring-2 ring-brand" : "card-hover",
                )}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl ring-1 transition-colors",
                      on ? "bg-brand text-brand-foreground ring-brand" : "bg-brand/8 text-brand ring-brand/15",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-6 place-items-center rounded-full border transition-colors",
                      on ? "border-brand bg-brand text-brand-foreground" : "text-muted-foreground group-hover:border-foreground/40",
                    )}
                  >
                    {on ? <CheckIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
                  </span>
                </span>
                <span className="text-h3 mt-5">{title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</span>

                {!on && (
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-brand">
                    See how we fix it
                    <ArrowRightIcon aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}

                {/* Revealed fix: animates open with grid-rows. */}
                <span
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                    on ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block rounded-xl bg-ink p-4 text-sm leading-relaxed text-ink-foreground">
                      <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-wider text-brand-on-ink uppercase">
                        <SparklesIcon aria-hidden="true" className="size-3" />
                        How we fix it
                      </span>
                      <span className="mt-1.5 block">{fix}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}

        {/* Summary tile */}
        <li className="relative isolate overflow-hidden rounded-2xl bg-ink text-ink-foreground">
          <div aria-hidden="true" className="absolute -inset-e-16 -bottom-16 -z-10 size-48 rounded-full bg-brand/40 blur-3xl" />
          <div className="flex h-full min-h-48 flex-col justify-between gap-6 p-6">
            <p aria-live="polite">
              {count === 0 ? (
                <span className="text-h3 text-2xl">
                  Tap the ones you <span className="accent-serif">recognise</span>
                </span>
              ) : (
                <>
                  <span className="block font-mono text-xs tracking-wider text-brand-on-ink uppercase">
                    {count} of {businessProblems.length} selected
                  </span>
                  <span className="text-h3 mt-2 block text-2xl">
                    We can help with <span className="accent-serif">{count === 1 ? "this" : "these"}</span>
                  </span>
                </>
              )}
            </p>
            <Link
              href={href}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
            >
              {count ? "Discuss these with us" : "Tell us how it works today"}
              <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </li>
      </ul>

      {/* Mobile: keep the next step in reach while selecting. */}
      <div
        className={cn(
          "fixed inset-x-3 bottom-3 z-30 transition-[transform,opacity] duration-300 lg:hidden",
          count > 0 && inView ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        aria-hidden={!(count > 0 && inView)}
      >
        <Link
          href={href}
          tabIndex={count > 0 && inView ? 0 : -1}
          className="flex items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-3.5 text-ink-foreground shadow-2xl shadow-black/30"
        >
          <span className="text-sm">
            <span className="font-semibold">{count} selected</span>
            <span className="text-ink-muted"> · Discuss with us</span>
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-brand text-brand-foreground">
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
