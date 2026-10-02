import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { InkBand } from "@/components/layout/ink-band";
import type { ProjectSummary } from "@/content/projects";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <InkBand as="div" className="grid rounded-3xl lg:grid-cols-[1fr_1.05fr]">
      <article className="flex flex-col p-7 sm:p-12">
        <span className="w-fit rounded-full border border-ink-border bg-ink-surface px-3 py-1 font-mono text-[0.6875rem] tracking-wider text-ink-muted uppercase">
          {project.label}
        </span>
        <h3 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.name}
        </h3>
        <p className="text-lead mt-4 text-ink-foreground/90">{project.tagline}</p>
        <p className="mt-4 leading-relaxed text-ink-muted">{project.summary}</p>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Capabilities">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ink-border px-3 py-1 text-xs text-ink-foreground/80"
            >
              {tag}
            </li>
          ))}
        </ul>
        <Link
          href={`/portfolio/${project.slug}`}
          className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-ink-foreground px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white"
        >
          View project details
          <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </article>

      {/* Illustrative interface until real screenshots are supplied (Phase 3). */}
      <div aria-hidden="true" className="relative hidden p-10 ps-0 lg:block">
        <div className="h-full rounded-2xl border border-ink-border bg-[#1a1a19] p-5 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 rounded-xl border border-ink-border bg-ink-surface px-3.5 py-2.5 text-sm text-ink-muted">
            <SearchIcon className="size-4" />
            What is our refund policy for bulk orders?
          </div>
          <div className="mt-5 rounded-xl border border-ink-border bg-black/20 p-4 text-sm leading-relaxed text-ink-foreground/85">
            Bulk orders above ₹50,000 can be refunded within 15 days if goods
            are unused. Approval from the sales head is required.
            <div className="mt-4 flex flex-wrap gap-2">
              {["Sales Policy v3.pdf · p.4", "Finance SOP.docx"].map((src) => (
                <span
                  key={src}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand/15 px-2 py-1 font-mono text-[0.625rem] text-orange-200"
                >
                  <FileTextIcon className="size-3" />
                  {src}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["Sources", "2 cited"],
              ["Access", "Sales team"],
              ["Status", "Verified"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-ink-border p-3">
                <p className="font-mono text-[0.625rem] tracking-wider text-ink-muted uppercase">{k}</p>
                <p className="mt-1 text-lg font-semibold text-ink-foreground">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[0.625rem] text-ink-muted">Illustrative interface</p>
        </div>
      </div>
    </InkBand>
  );
}
