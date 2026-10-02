import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { PageHero } from "@/components/sections/page-hero";
import { engagementSteps, faqs } from "@/content/process";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How We Work — From Business Problem to Working Software",
  description:
    "Our seven-step engagement process: understand, map, design, prototype, develop, deploy, and improve. Clear scope, early prototypes, and regular demos.",
  path: "/how-we-work",
});

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="Simple process. Working software early. No surprises."
        description="We start with your business, not with technology. You see a working prototype before full development, and progress every one to two weeks after that."
      />

      <Section>
        <ol className="relative space-y-4">
          {engagementSteps.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-6 rounded-xl border bg-card p-6 sm:p-8 md:grid-cols-[minmax(0,14rem)_1fr_1fr] md:gap-10"
            >
              <div>
                <span className="font-mono text-xs text-brand">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-h3 mt-2 text-2xl">{step.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.summary}
                </p>
              </div>
              <div>
                <h3 className="eyebrow">What happens</h3>
                <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm leading-relaxed marker:text-muted-foreground">
                  {step.whatHappens.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow">What you get</h3>
                <p className="mt-3 text-sm leading-relaxed">{step.youGet}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeader
            eyebrow="Questions"
            title="Common questions"
            description="If your question isn't here, ask us directly. We're happy to talk it through."
          />
          <FaqList items={faqs} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
