import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects personal information.`,
  path: "/privacy",
});

// Draft policy written for the planned architecture (docs/architecture.md).
// Must be reviewed before launch and kept in sync if services change.
const LAST_UPDATED = "2 October 2026";

export default function PrivacyPage() {
  const { name, contact } = siteConfig;

  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="text-h2 mt-4">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-12 space-y-10 leading-relaxed [&_h2]:text-h3 [&_h2]:mb-3 [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:text-muted-foreground [&_p]:text-muted-foreground [&_p+p]:mt-3">
          <section>
            <p>
              This policy explains what personal information {name} (&ldquo;we&rdquo;)
              collects through this website, why, and how we protect it. We
              collect as little as possible and never sell personal information.
            </p>
          </section>

          <section>
            <h2>What we collect</h2>
            <ul>
              <li>
                <strong className="text-foreground">Enquiries.</strong> When you use the
                contact form: your name, work email, and the details you choose
                to share (company, phone, company size, industry, timeline,
                budget, and your description of the business problem).
              </li>
              <li>
                <strong className="text-foreground">AI demo inputs.</strong> When you use
                the AI demo: the text you enter and the generated suggestion.
              </li>
              <li>
                <strong className="text-foreground">Technical data.</strong> A one-way
                hashed (anonymised) form of your IP address, used only to prevent
                spam and abuse, and standard server logs kept by our hosting
                provider.
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2>How we use it</h2>
            <ul>
              <li>To reply to your enquiry and discuss your project.</li>
              <li>To run and improve the AI demo, and to understand which business problems visitors care about.</li>
              <li>To protect the website from spam and misuse.</li>
            </ul>
            <p className="mt-3">
              We will not add you to a mailing list without your separate consent.
            </p>
          </section>

          <section>
            <h2>AI demo</h2>
            <p>
              The AI demo sends the text you enter to a third-party AI provider
              (currently Google&apos;s Gemini API) to generate a suggestion.
              Depending on the provider&apos;s terms, inputs may be used by the
              provider to improve its services.{" "}
              <strong className="text-foreground">
                Please do not enter confidential, personal, or sensitive information
                into the demo.
              </strong>{" "}
              Demo suggestions are illustrative only and are not professional advice.
            </p>
          </section>

          <section>
            <h2>Who we share it with</h2>
            <p>
              We use a small number of service providers to operate this website:
              a hosting provider, a database provider (Supabase), an email
              delivery provider (Resend) for enquiry notifications, and an AI
              provider for the demo. They process data on our behalf and only as
              needed to provide their service. Some providers may store data
              outside India.
            </p>
          </section>

          <section>
            <h2>How long we keep it</h2>
            <ul>
              <li>Enquiries: for as long as needed to respond and manage any resulting business relationship, or until you ask us to delete them.</li>
              <li>AI demo records: automatically deleted after 90 days.</li>
            </ul>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              Under applicable law, including India&apos;s Digital Personal Data
              Protection Act, 2023, you can ask us to access, correct, or delete
              your personal information, or withdraw consent. Email{" "}
              <a href={`mailto:${contact.email}`} className="font-medium text-foreground underline underline-offset-2">
                {contact.email}
              </a>{" "}
              and we will respond within a reasonable time. This address is also
              the contact for any privacy concern or grievance.
            </p>
          </section>

          <section>
            <h2>Security</h2>
            <p>
              We protect data with encryption in transit, access controls, and
              restricted administrative access. No system is perfectly secure,
              but we take reasonable measures appropriate to the information we hold.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              We may update this policy as our services change. The date at the
              top shows when it was last revised.
            </p>
          </section>
        </div>
      </article>
    </Container>
  );
}
