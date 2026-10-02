import { Container } from "@/components/layout/container";
import { InkBand } from "@/components/layout/ink-band";
import { Eyebrow } from "@/components/layout/section";

/** Top-of-page introduction for inner pages (ink band). */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <InkBand>
      <Container className="animate-rise pt-20 pb-20 sm:pt-28 sm:pb-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-display mt-6 max-w-4xl">{title}</h1>
        {description && (
          <p className="text-lead mt-6 max-w-2xl text-ink-muted">{description}</p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </InkBand>
  );
}
