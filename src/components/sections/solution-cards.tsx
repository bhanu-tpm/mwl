import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { Solution } from "@/content/solutions";

export function SolutionCards({ solutions }: { solutions: Solution[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {solutions.map(({ id, title, summary, icon: Icon }, i) => (
        <li key={id}>
          <Link
            href={`/solutions#${id}`}
            className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-colors hover:border-foreground/30 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ArrowUpRightIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </div>
            <Icon aria-hidden="true" className="mt-8 size-6" />
            <h3 className="text-h3 mt-4">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
