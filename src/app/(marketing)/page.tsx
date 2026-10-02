import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { InkBand } from "@/components/layout/ink-band";
import { Eyebrow, Section, SectionHeader } from "@/components/layout/section";
import { AiDemoPreview } from "@/components/demo/ai-demo-preview";
import { ProjectCard } from "@/components/portfolio/project-card";
import { CtaBand } from "@/components/sections/cta-band";
import { DeliveryStages } from "@/components/sections/delivery-stages";
import { HeroTransform } from "@/components/sections/hero-transform";
import { ProblemGrid } from "@/components/sections/problem-grid";
import { SolutionCards } from "@/components/sections/solution-cards";
import { businessProblems } from "@/content/problems";
import { projects } from "@/content/projects";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";
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
              Most businesses don&apos;t need more software. They need{" "}
              <span className="accent-serif">fewer manual steps.</span>
            </>
          }
          description="If any of these sound familiar, your business is spending time and money on work that software can do."
        />
        <div className="mt-16">
          <ProblemGrid problems={businessProblems} />
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

      <Section id="ai">
        <SectionHeader
          eyebrow="03 — AI in practice"
          title={
            <>
              From a manual process to a <span className="accent-serif">clear workflow</span>
            </>
          }
          description="Start with a real business problem, then design a practical workflow where AI does the repetitive work and people stay in control."
        />
        <div className="mt-16">
          <AiDemoPreview />
        </div>
        <Button asChild variant="outline" size="lg" className="mt-10 bg-card">
          <Link href="/solutions#ai-business-automation">
            Explore AI Solutions
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </Section>

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
