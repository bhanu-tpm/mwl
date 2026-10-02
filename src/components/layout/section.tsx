import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = React.ComponentProps<"section"> & {
  tone?: "default" | "muted";
  containerClassName?: string;
};

const tones = {
  default: "",
  muted: "bg-muted/60 border-y",
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
      className={cn("py-20 sm:py-28 lg:py-32", tones[tone], className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Eyebrow with a small vermilion marker, e.g. "■ 01 — The problem". */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="size-1.5 rounded-[1px] bg-brand" />
      {children}
    </p>
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
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <Heading className={Heading === "h1" ? "text-display" : "text-h2"}>
        {title}
      </Heading>
      {description && (
        <p className="text-lead mt-6 max-w-2xl text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
