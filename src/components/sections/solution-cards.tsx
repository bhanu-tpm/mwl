import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { Solution } from "@/content/solutions";

export function SolutionCards({ solutions }: { solutions: Solution[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {solutions.map(({ id, title, summary, icon: Icon, examples }, i) => (
        <li key={id}>
          <Link
            href={`/solutions#${id}`}
            className="card-elevated card-hover group flex h-full flex-col p-7 sm:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-ink text-ink-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid size-9 place-items-center rounded-full border transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                  <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                </span>
              </span>
            </div>
            <h3 className="mt-10 text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{summary}</p>
            <ul className="mt-8 flex flex-wrap gap-2 border-t pt-6">
              {examples.slice(0, 3).map((e) => (
                <li key={e} className="rounded-full bg-muted px-3 py-1 text-xs">
                  {e}
                </li>
              ))}
            </ul>
          </Link>
        </li>
      ))}
    </ul>
  );
}
