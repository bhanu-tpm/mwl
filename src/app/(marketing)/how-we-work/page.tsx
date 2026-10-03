import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { PageHero } from "@/components/sections/page-hero";
import { engagementSteps, faqs } from "@/content/process";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "How We Work — From Business Problem to Working Software",
  description:
    "Our seven-step engagement process: understand, map, design, prototype, develop, deploy, and improve. Clear scope, early prototypes, and regular demos.",
  path: "/how-we-work",
});

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "How We Work", path: "/how-we-work" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />
      <PageHero
        eyebrow="How we work"
        title={<>Simple process. Working software early. <span className="accent-serif">No surprises.</span></>}
        description="We start with your business, not with technology. You see a working prototype before full development, and progress every one to two weeks after that."
      />

      <Section>
        <ol className="relative space-y-4">
          {engagementSteps.map((step, i) => (
            <li
              key={step.title}
              className="card-elevated grid gap-6 p-7 sm:p-10 md:grid-cols-[minmax(0,15rem)_1fr_1fr] md:gap-12"
            >
              <div>
                <span className="accent-serif text-5xl leading-none text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">{step.title}</h2>
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
