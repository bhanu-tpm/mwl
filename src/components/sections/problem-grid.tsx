import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { BusinessProblem } from "@/content/problems";

/** Problems plus a closing CTA tile (7 + 1 keeps the 2- and 4-column grids complete). */
export function ProblemGrid({ problems }: { problems: BusinessProblem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {problems.map(({ title, description, icon: Icon }) => (
        <li key={title} className="card-elevated card-hover flex gap-4 p-5 sm:block sm:p-7">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand ring-1 ring-brand/15">
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
          <div>
            <h3 className="text-h3 sm:mt-6">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2.5">
              {description}
            </p>
          </div>
        </li>
      ))}
      <li className="relative isolate overflow-hidden rounded-2xl bg-ink text-ink-foreground">
        <div
          aria-hidden="true"
          className="absolute -inset-e-16 -bottom-16 -z-10 size-48 rounded-full bg-brand/40 blur-3xl"
        />
        <Link
          href="/contact"
          className="group flex h-full min-h-36 flex-col sm:min-h-48 justify-between gap-8 p-6 sm:p-7"
        >
          <span className="text-h3 text-2xl">
            Recognise <span className="accent-serif">one of these?</span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            Tell us how it works today
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </Link>
      </li>
    </ul>
  );
}
