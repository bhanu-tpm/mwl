import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/** Top-of-page introduction for inner pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b", className)}>
      <Container className="py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-display mt-5 max-w-4xl">{title}</h1>
        {description && (
          <p className="text-lead mt-6 max-w-2xl text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  );
}
