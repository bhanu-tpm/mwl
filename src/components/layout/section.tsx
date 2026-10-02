import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = React.ComponentProps<"section"> & {
  tone?: "default" | "muted" | "deep";
  containerClassName?: string;
};

const tones = {
  default: "",
  muted: "bg-muted",
  deep: "bg-deep text-deep-foreground",
};

/** Page section with consistent vertical rhythm. */
export function Section({
  tone = "default",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-16 sm:py-24 lg:py-28", tones[tone], className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Heading className={Heading === "h1" ? "text-display" : "text-h2"}>
        {title}
      </Heading>
      {description && (
        <p className="text-lead mt-5 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
