import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectSummary } from "@/content/projects";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="grid overflow-hidden rounded-xl border bg-card lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col p-6 sm:p-10">
        <Badge variant="outline" className="font-mono text-[0.6875rem] uppercase tracking-wider">
          {project.label}
        </Badge>
        <h3 className="text-h2 mt-6">{project.name}</h3>
        <p className="text-lead mt-3">{project.tagline}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">{project.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Capabilities">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs">
              {tag}
            </li>
          ))}
        </ul>
        <Link
          href={`/portfolio/${project.slug}`}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm font-medium underline-offset-4 hover:underline"
        >
          View project details
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </div>
      {/* Visual placeholder until real screenshots are supplied (Phase 3). */}
      <div
        aria-hidden="true"
        className="relative hidden min-h-72 border-t bg-muted lg:block lg:border-t-0 lg:border-s"
      >
        <div className="absolute inset-8 rounded-lg border bg-background p-5 shadow-sm">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="ms-auto h-8 w-3/4 rounded-md bg-primary/90" />
            <div className="h-16 w-5/6 rounded-md border bg-card p-3">
              <div className="h-2 w-full rounded bg-muted" />
              <div className="mt-2 h-2 w-4/5 rounded bg-muted" />
              <div className="mt-3 h-2 w-1/3 rounded bg-brand/40" />
            </div>
            <div className="ms-auto h-8 w-1/2 rounded-md bg-primary/90" />
          </div>
        </div>
      </div>
    </article>
  );
}
