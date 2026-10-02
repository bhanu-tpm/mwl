import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { BusinessProblem } from "@/content/problems";

/** Problems plus a closing CTA tile (7 + 1 keeps the 2- and 4-column grids complete). */
export function ProblemGrid({ problems }: { problems: BusinessProblem[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {problems.map(({ title, description, icon: Icon }) => (
        <li key={title} className="bg-background p-6 sm:p-7">
          <Icon aria-hidden="true" className="size-5 text-brand" />
          <h3 className="text-h3 mt-5">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </li>
      ))}
      <li className="bg-primary text-primary-foreground">
        <Link
          href="/contact"
          className="group flex h-full flex-col justify-between gap-8 p-6 sm:p-7"
        >
          <span className="text-h3">Recognise one of these?</span>
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            Tell us how it works today
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </li>
    </ul>
  );
}
