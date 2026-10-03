import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { capabilities, founder, principles } from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "About — Business-First Product Engineering",
  description:
    "Mithila Web Labs combines business understanding, product thinking, software engineering, and AI to build practical digital products for growing businesses.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <PageHero
        eyebrow="About"
        title={<>We build practical technology for <span className="accent-serif">real businesses</span></>}
        description="Mithila Web Labs is a product engineering company. We help growing businesses replace manual processes with software and AI that their teams actually use."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader eyebrow="Our story" title={<>Why we <span className="accent-serif">started</span></>} />
          <div className="text-lead space-y-6">
            <p>
              Many growing businesses still run on spreadsheets, email, and
              WhatsApp. They don&apos;t lack ambition. They lack a technology
              partner who understands the business first.
            </p>
            <p className="text-muted-foreground">
              Large IT firms are built for large budgets. Freelancers often
              build what is asked for without questioning whether it solves the
              problem. We sit in between: we think like a product company,
              engineer like one, and the people who design your solution are
              the people who build it.
            </p>
            <p className="text-muted-foreground">
              Modern web technology and AI have made it possible to build
              powerful business software faster and at lower cost than ever
              before. Our job is to make that practical for businesses that
              don&apos;t have their own technology team.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeader
          eyebrow="What we bring"
          title={<>Four disciplines, <span className="accent-serif">one team</span></>}
          description="The best business software comes from combining all four. Most projects that fail are missing at least one."
        />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ title, description, icon: Icon }) => (
            <li key={title} className="card-elevated p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-ink text-ink-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-h3 mt-5">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow="Principles" title={<>How we make <span className="accent-serif">decisions</span></>} />
        <dl className="mt-12 divide-y border-y">
          {principles.map((p, i) => (
            <div key={p.title} className="grid gap-2 py-6 md:grid-cols-[1fr_2fr] md:gap-8">
              <dt className="flex gap-6 font-semibold md:gap-10">
                <span className="w-6 shrink-0 pt-1 font-mono text-xs font-normal text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.title}
              </dt>
              <dd className="text-muted-foreground">{p.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {founder && (
        <Section tone="muted" aria-labelledby="founder-title">
          <div className="grid gap-10 md:grid-cols-[16rem_1fr] md:gap-16">
            {founder.photo && (
              <Image
                src={founder.photo}
                alt={`Portrait of ${founder.name}`}
                width={512}
                height={640}
                className="aspect-4/5 w-full max-w-64 rounded-xl border object-cover"
              />
            )}
            <div>
              <p className="eyebrow">Founder</p>
              <h2 id="founder-title" className="text-h2 mt-4">{founder.name}</h2>
              <p className="mt-1 text-muted-foreground">{founder.role}</p>
              <p className="text-lead mt-6 max-w-2xl">{founder.bio}</p>
              {founder.linkedin && (
                <a
                  href={founder.linkedin}
                  className="mt-6 inline-block rounded-sm font-medium underline underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
