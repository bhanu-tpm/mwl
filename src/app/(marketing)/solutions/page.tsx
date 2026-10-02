import { CheckIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { WorkflowChain } from "@/components/sections/workflow-chain";
import { solutions, type Solution } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Solutions — AI Automation & Custom Business Software",
  description:
    "AI business automation, custom business applications, AI knowledge systems, and customer portals for growing businesses. See the problem, our approach, and the business benefit.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={<>Practical software for <span className="accent-serif">real business problems</span></>}
        description="Every solution starts with how your business works today. Here is what we build, how we approach it, and what it changes."
      >
        <nav aria-label="Solutions on this page">
          <ul className="flex flex-wrap gap-2">
            {solutions.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex rounded-full border border-ink-border bg-ink-surface px-4 py-2 text-sm text-ink-foreground/85 transition-colors hover:border-white/25 hover:text-ink-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {solutions.map((solution, i) => (
        <SolutionDetail key={solution.id} solution={solution} index={i} />
      ))}

      <CtaBand
        title="Not sure which of these fits?"
        description="Most real problems span more than one category. Describe yours and we'll suggest where to start."
        cta={{ label: "Discuss Your Business Problem", href: "/contact" }}
      />
    </>
  );
}

function SolutionDetail({ solution, index }: { solution: Solution; index: number }) {
  const Icon = solution.icon;

  return (
    <section
      id={solution.id}
      aria-labelledby={`${solution.id}-title`}
      className={cn("scroll-mt-16 border-b py-20 sm:py-28", index % 2 === 1 && "bg-muted/60")}
    >
      <Container>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-ink-foreground">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(solutions.length).padStart(2, "0")}
          </span>
        </div>
        <h2 id={`${solution.id}-title`} className="text-h2 mt-8 max-w-3xl">
          {solution.title}
        </h2>
        <p className="text-lead mt-4 max-w-2xl text-muted-foreground">{solution.summary}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <Block label="The problem">{solution.problem}</Block>
            <Block label="Our approach">{solution.approach}</Block>
            <div>
              <h3 className="eyebrow">Business benefit</h3>
              <ul className="mt-3 space-y-2">
                {solution.benefits.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <CheckIcon aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Typical projects</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {solution.examples.map((e) => (
                  <li key={e} className="rounded-full border bg-card px-3 py-1 text-sm">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-elevated h-fit p-7 sm:p-9">
            <h3 className="eyebrow">Example</h3>
            <p className="mt-3 leading-relaxed">{solution.example.scenario}</p>
            <WorkflowChain steps={solution.example.workflow} className="mt-6" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow">{label}</h3>
      <p className="mt-3 leading-relaxed">{children}</p>
    </div>
  );
}
