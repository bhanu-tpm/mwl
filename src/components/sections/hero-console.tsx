import { BotIcon, CheckIcon, MessageCircleIcon } from "lucide-react";

const extracted = [
  { field: "Customer", value: "Sharma Traders, Pune" },
  { field: "Item", value: "PVC pipe 2″ × 120" },
  { field: "Item", value: "Elbow joint × 300" },
  { field: "Delivery", value: "Friday, 10 Oct" },
];

/**
 * Static product-style mockup for the home hero: a chat order becomes structured,
 * validated data awaiting approval. Decorative; the same story is told in text nearby.
 */
export function HeroConsole() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-[1.375rem] bg-linear-to-b from-white/15 to-white/0"
      />
      <figure className="relative overflow-hidden rounded-[1.3rem] border border-ink-border bg-[#161615]/90 shadow-2xl shadow-black/40 backdrop-blur">
        <figcaption className="flex items-center justify-between border-b border-ink-border px-5 py-3.5">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="font-mono text-[0.6875rem] tracking-wider text-ink-muted uppercase">
            Order intake · example
          </span>
        </figcaption>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Incoming message */}
          <div className="flex gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#5ee08f]">
              <MessageCircleIcon aria-hidden="true" className="size-4" />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-ink-border bg-ink-surface px-4 py-3 text-sm leading-relaxed text-ink-foreground/90">
              Hi, please send 120 PVC pipes 2 inch and 300 elbow joints by
              Friday. Same rate as last time. – Sharma Traders
              <span className="mt-1.5 block font-mono text-[0.625rem] text-ink-muted">
                WhatsApp · 09:42
              </span>
            </div>
          </div>

          {/* AI extraction */}
          <div className="rounded-xl border border-ink-border bg-black/20">
            <div className="flex items-center gap-2 border-b border-ink-border px-4 py-2.5">
              <BotIcon aria-hidden="true" className="size-3.5 text-brand" />
              <span className="font-mono text-[0.6875rem] tracking-wider text-ink-muted uppercase">
                Extracted by AI
              </span>
              <span className="ms-auto rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[0.625rem] text-emerald-300">
                98% match
              </span>
            </div>
            <dl className="divide-y divide-white/5 text-sm">
              {extracted.map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <dt className="text-ink-muted">{row.field}</dt>
                  <dd className="text-end text-ink-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Validation + approval */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["Price list matched", "Stock available"].map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-border px-2.5 py-1 text-ink-foreground/80"
              >
                <CheckIcon aria-hidden="true" className="size-3 text-emerald-300" />
                {check}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.06] p-3 ps-4">
            <span className="text-sm text-ink-foreground/80">Awaiting sales approval</span>
            <span className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground">
              Approve
            </span>
          </div>
        </div>
      </figure>
    </div>
  );
}
