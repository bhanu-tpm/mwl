import { MailIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact — Discuss Your Business Problem",
  description:
    "Tell us about the business process you want to improve. We reply within one business day with practical next steps.",
  path: "/contact",
});

const nextSteps = [
  {
    title: "We reply within one business day",
    description: "A real person reads your message, usually with a few follow-up questions.",
  },
  {
    title: "A short call to understand your process",
    description: "30 minutes, no obligation. We focus on your business, not a sales pitch.",
  },
  {
    title: "Practical recommendations",
    description: "A clear summary of what could be digitized, automated, or improved with AI, and where to start.",
  },
];

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <section>
      <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="text-display mt-5">Tell us about your business problem</h1>
          <p className="text-lead mt-6 max-w-2xl text-muted-foreground">
            You don&apos;t need a specification. Describe how things work today
            and what you&apos;d like to change. Only three fields are required.
          </p>
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>

        <aside aria-label="What happens next" className="space-y-10 lg:pt-36">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="eyebrow">What happens next</h2>
            <ol className="mt-6 space-y-6">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-mono text-xs text-brand pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="eyebrow">Prefer to reach us directly?</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-3 rounded-sm hover:underline underline-offset-4"
                >
                  <MailIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {contact.email}
                </a>
              </li>
              {contact.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    className="inline-flex items-center gap-3 rounded-sm hover:underline underline-offset-4"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MessageCircleIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              <li className="inline-flex items-center gap-3 text-muted-foreground">
                <MapPinIcon aria-hidden="true" className="size-4" />
                {contact.location} · Working with clients remotely
              </li>
            </ul>
          </div>
        </aside>
      </Container>
    </section>
  );
}
