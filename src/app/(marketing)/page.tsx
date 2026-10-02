import Link from "next/link";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section, SectionHeader } from "@/components/layout/section";
import { AiDemoPreview } from "@/components/demo/ai-demo-preview";
import { ProjectCard } from "@/components/portfolio/project-card";
import { CtaBand } from "@/components/sections/cta-band";
import { DeliveryStages } from "@/components/sections/delivery-stages";
import { ProblemGrid } from "@/components/sections/problem-grid";
import { SolutionCards } from "@/components/sections/solution-cards";
import { WorkflowChain } from "@/components/sections/workflow-chain";
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

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section id="problems">
        <SectionHeader
          eyebrow="01 — The problem"
          title="Most businesses don't need more software. They need fewer manual steps."
          description="If any of these sound familiar, your business is spending time and money on work that software can do. We help you fix that."
        />
        <div className="mt-12">
          <ProblemGrid problems={businessProblems} />
        </div>
      </Section>

      <Section id="what-we-build" tone="muted">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="02 — What we build"
            title="Four ways we turn business problems into working software"
          />
          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href="/solutions">All solutions</Link>
          </Button>
        </div>
        <div className="mt-12">
          <SolutionCards solutions={solutions} />
        </div>
      </Section>

      <Section id="ai">
        <SectionHeader
          eyebrow="03 — AI in practice"
          title="From a manual process to a clear, automated workflow"
          description="This is how we think about AI: start with a real business problem, then design a practical workflow where AI does the repetitive work and people stay in control."
        />
        <div className="mt-12">
          <AiDemoPreview />
        </div>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <Link href="/solutions#ai-business-automation">
            Explore AI Solutions
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </Section>

      <Section id="work" tone="muted">
        <SectionHeader
          eyebrow="04 — Featured work"
          title="Proof that we build, not just advise"
          description="Our own products are where we test ideas and show how we design and build real AI applications."
        />
        <div className="mt-12 space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <Section id="how-we-work">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="05 — How we work"
            title="A clear path from problem to working software"
            description="You see progress at every stage, and a working prototype before full development begins."
          />
          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href="/how-we-work">Our process</Link>
          </Button>
        </div>
        <div className="mt-12">
          <DeliveryStages />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b">
      <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:py-28">
        <div>
          <p className="eyebrow">Product engineering · AI · Automation</p>
          <h1 className="text-display mt-6">
            AI-Powered Business Applications{" "}
            <span className="text-muted-foreground">&amp; Digital Products</span>
          </h1>
          <p className="text-lead mt-6 max-w-xl text-muted-foreground">
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
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">Explore Our Work</Link>
            </Button>
          </div>
        </div>

        <BeforeAfter />
      </Container>
    </section>
  );
}

/** Small visual showing the kind of change we make: manual steps → a clear workflow. */
function BeforeAfter() {
  const before = ["Order arrives on WhatsApp", "Retyped into Excel", "Customer calls for status"];

  return (
    <figure className="rounded-xl border bg-card p-5 sm:p-6">
      <figcaption className="eyebrow">Example: order processing</figcaption>
      <div className="mt-5">
        <p className="text-xs font-medium text-muted-foreground">Today</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {before.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <XIcon aria-hidden="true" className="size-3.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t pt-5">
        <p className="text-xs font-medium text-muted-foreground">With the right system</p>
        <WorkflowChain
          className="mt-3"
          steps={[
            { label: "Order captured", type: "input" },
            { label: "AI reads the details", type: "ai" },
            { label: "Team approves", type: "human" },
            { label: "Customer updated", type: "output" },
          ]}
        />
      </div>
    </figure>
  );
}
