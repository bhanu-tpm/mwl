import { BotIcon, ListChecksIcon, MessagesSquareIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { InkBand } from "@/components/layout/ink-band";
import { Eyebrow, Section, SectionHeader } from "@/components/layout/section";
import { AiDemo } from "@/components/demo/ai-demo";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "AI Demo — See How Your Process Could Be Automated",
  description:
    "Describe a manual business process and see a suggested workflow: where AI helps, where people stay in control, and the practical benefits.",
  path: "/ai-demo",
});

const howItWorks = [
  {
    icon: ListChecksIcon,
    title: "Examples are prepared by us",
    text: "The example buttons show answers we wrote and checked. They load instantly.",
  },
  {
    icon: BotIcon,
    title: "Your own text goes to an AI model",
    text: "We send it to Google's Gemini model and check the answer against a fixed format before showing it. Please don't include confidential details.",
  },
  {
    icon: MessagesSquareIcon,
    title: "A suggestion, not a proposal",
    text: "Real recommendations come from understanding your process. The demo is a starting point for that conversation.",
  },
];

export default function AiDemoPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "AI Demo", path: "/ai-demo" }])} />
      <InkBand glow="center">
        <Container className="max-w-4xl pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="animate-rise text-center">
            <Eyebrow className="justify-center">AI demo</Eyebrow>
            <h1 className="text-display mt-6">
              Describe a process. <span className="accent-serif">See how we&apos;d fix it.</span>
            </h1>
            <p className="text-lead mx-auto mt-6 max-w-2xl text-ink-muted">
              Tell us how one piece of work happens today. In a few seconds you&apos;ll see a
              practical workflow: where AI helps, and where your team stays in control.
            </p>
          </div>
          <div className="mt-12">
            <AiDemo />
          </div>
        </Container>
      </InkBand>

      <Section>
        <SectionHeader eyebrow="Transparency" title={<>How this demo <span className="accent-serif">works</span></>} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {howItWorks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card-elevated p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-ink text-ink-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h2 className="text-h3 mt-6">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
