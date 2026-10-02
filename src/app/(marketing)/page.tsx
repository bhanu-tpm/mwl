import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { InkBand } from "@/components/layout/ink-band";
import { Eyebrow, Section, SectionHeader } from "@/components/layout/section";
import { ProjectCard } from "@/components/portfolio/project-card";
import { AiInPractice } from "@/components/sections/ai-in-practice";
import { CtaBand } from "@/components/sections/cta-band";
import { DeliveryStages } from "@/components/sections/delivery-stages";
import { HeroTransform } from "@/components/sections/hero-transform";
import { ProblemFlow } from "@/components/sections/problem-flow";
import { ProblemPicker } from "@/components/sections/problem-picker";
import { SolutionCards } from "@/components/sections/solution-cards";
import { aiGuardrails, autonomyLadder } from "@/content/ai-scenarios";
import { projects } from "@/content/projects";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata = {
  ...pageMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
  }),
  // Home uses the full title, not the "%s · Mithila Web Labs" template.
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
};

const heroPoints = ["Working prototype in weeks", "You own the code", "Security built in"];

export default function HomePage() {
  return (
    <>
      <InkBand>
        <Container className="grid gap-16 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12">
          <div className="animate-rise">
            <Eyebrow>Product engineering · AI · Automation</Eyebrow>
            <h1 className="text-display-xl mt-7">
              AI-Powered Business Applications{" "}
              <span className="accent-serif text-ink-foreground/85">&amp; Digital Products</span>
            </h1>
            <p className="text-lead mt-7 max-w-xl text-ink-muted">
              We turn business problems into practical digital products,
              intelligent workflows, and AI-powered applications.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="brand" size="lg">
                <Link href="/contact">
                  Discuss Your Business Problem
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline-ink" size="lg">
                <Link href="/portfolio">Explore Our Work</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckIcon aria-hidden="true" className="size-4 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <HeroTransform />
          </div>
        </Container>
      </InkBand>

      <Section id="problems">
        <SectionHeader
          eyebrow="01 — The problem"
          title={
            <>
              Which of these sound <span className="accent-serif">familiar?</span>
            </>
          }
          description="Tap the problems your business faces. We'll show how we fix each one, and you can send them straight to us."
        />
        <div className="mt-14">
          <ProblemFlow />
        </div>
        <div className="mt-6">
          <ProblemPicker />
        </div>
      </Section>

      <Section id="what-we-build" tone="muted">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="02 — What we build"
            title={
              <>
                Four ways we turn problems into{" "}
                <span className="accent-serif">working software</span>
              </>
            }
          />
          <Button asChild variant="outline" size="lg" className="w-fit bg-card">
            <Link href="/solutions">
              All solutions
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <div className="mt-16">
          <SolutionCards solutions={solutions} />
        </div>
      </Section>

      <InkBand id="ai" glow="end">
        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <Eyebrow>03 — AI in practice</Eyebrow>
            <h2 className="text-h2 mt-5">
              See AI do the work. <span className="accent-serif">Your team</span> makes the calls.
            </h2>
            <p className="text-lead mt-6 max-w-2xl text-ink-muted">
              Pick an industry to see a typical run: AI reads the messy input, checks it, and
              hands only the exceptions to a person.
            </p>
          </div>

          <div className="mt-14">
            <AiInPractice />
          </div>

          <div className="mt-20 grid gap-12 border-t border-ink-border pt-14 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                How we put AI to <span className="accent-serif">work</span>
              </h3>
              <p className="mt-3 leading-relaxed text-ink-muted">
                We start small and earn trust. AI takes on more only after it has proven itself
                on your real work.
              </p>
              <ul className="mt-8 space-y-4">
                {aiGuardrails.map((g) => (
                  <li key={g.title} className="flex gap-3">
                    <ShieldCheckIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-on-ink" />
                    <span>
                      <span className="block font-medium">{g.title}</span>
                      <span className="text-sm text-ink-muted">{g.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ol className="grid gap-3 sm:grid-cols-3">
              {autonomyLadder.map((rung, i) => (
                <li
                  key={rung.step}
                  className={cn(
                    "relative flex flex-col rounded-2xl border border-ink-border bg-ink-surface p-5",
                    // Rising staircase on wider screens: each stage hands AI more responsibility.
                    ["sm:mt-12", "sm:mt-6", "sm:mt-0"][i],
                    i === autonomyLadder.length - 1 && "border-brand-on-ink/40",
                  )}
                >
                  <span className="font-mono text-xs text-brand-on-ink">Stage {i + 1}</span>
                  <span className="mt-2 text-lg font-semibold">{rung.step}</span>
                  <span className="mt-1 text-sm text-ink-foreground/85">{rung.title}</span>
                  <span className="mt-3 text-sm leading-relaxed text-ink-muted">{rung.description}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/contact">
                Describe your process
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline-ink" size="lg">
              <Link href="/solutions#ai-business-automation">Explore AI Solutions</Link>
            </Button>
          </div>
        </Container>
      </InkBand>

      <Section id="work" tone="muted">
        <SectionHeader
          eyebrow="04 — Featured work"
          title={
            <>
              Proof that we build, <span className="accent-serif">not just advise</span>
            </>
          }
          description="Our own products are where we test ideas and show how we design and build real AI applications."
        />
        <div className="mt-16 space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <Section id="how-we-work">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="05 — How we work"
            title={
              <>
                A clear path from problem to <span className="accent-serif">working software</span>
              </>
            }
            description="You see progress at every stage, and a working prototype before full development begins."
          />
          <Button asChild variant="outline" size="lg" className="w-fit bg-card">
            <Link href="/how-we-work">
              Our process
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <div className="mt-16">
          <DeliveryStages />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
