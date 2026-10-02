import {
  BotIcon,
  DatabaseIcon,
  FlagIcon,
  InboxIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep, WorkflowStepType } from "@/types/workflow";

const stepStyles: Record<
  WorkflowStepType,
  { icon: LucideIcon; label: string; className: string }
> = {
  input: { icon: InboxIcon, label: "Input", className: "bg-card" },
  ai: {
    icon: BotIcon,
    label: "AI",
    className: "border-brand/40 bg-brand/5 text-foreground",
  },
  system: { icon: DatabaseIcon, label: "System", className: "bg-card" },
  human: { icon: UserCheckIcon, label: "Person", className: "bg-card" },
  output: {
    icon: FlagIcon,
    label: "Result",
    className: "bg-primary text-primary-foreground border-primary",
  },
};

/**
 * Renders a business workflow as a chain of typed steps.
 * Vertical by default; `direction="responsive"` switches to horizontal on wide screens.
 * Step type is conveyed by icon + text label, never by colour alone.
 */
export function WorkflowChain({
  steps,
  direction = "vertical",
  className,
}: {
  steps: WorkflowStep[];
  direction?: "vertical" | "responsive";
  className?: string;
}) {
  const responsive = direction === "responsive";

  return (
    <ol
      className={cn(
        "flex flex-col gap-2",
        responsive && "lg:flex-row lg:flex-wrap lg:items-stretch",
        className,
      )}
    >
      {steps.map((step, i) => {
        const style = stepStyles[step.type];
        const Icon = style.icon;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={`${step.label}-${i}`}
            className={cn("flex flex-col gap-2", responsive && "lg:flex-row lg:items-center")}
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm shadow-[0_1px_2px_rgb(20_20_19/0.04)]",
                style.className,
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="font-medium">{step.label}</span>
              <span className="ms-auto ps-2 font-mono text-[0.6875rem] uppercase tracking-wider opacity-70">
                {style.label}
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "ms-5 h-3 w-px bg-border",
                  responsive && "lg:ms-0 lg:h-px lg:w-3",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
