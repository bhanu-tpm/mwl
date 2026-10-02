import { deliveryStages } from "@/content/process";

/** 9-stage timeline: vertical on mobile, a single connected row on large screens. */
export function DeliveryStages() {
  return (
    <ol className="relative grid gap-0 lg:grid-cols-9">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 inset-s-1.75 w-px bg-border lg:inset-x-0 lg:top-1.75 lg:bottom-auto lg:h-px lg:w-auto"
      />
      {deliveryStages.map((stage, i) => (
        <li key={stage} className="relative flex items-center gap-5 py-3 lg:flex-col lg:items-start lg:gap-5 lg:py-0 lg:pe-3">
          <span
            aria-hidden="true"
            className={
              i === 0 || i === deliveryStages.length - 1
                ? "size-3.75 shrink-0 rounded-full border-4 border-background bg-brand ring-1 ring-brand"
                : "size-3.75 shrink-0 rounded-full border-4 border-background bg-foreground/80 ring-1 ring-border"
            }
          />
          <div>
            <span className="font-mono text-xs text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-medium">{stage}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
