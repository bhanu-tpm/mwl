import { deliveryStages } from "@/content/process";

/** Compact 9-stage strip: Discovery → … → Support. */
export function DeliveryStages() {
  return (
    <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3 lg:grid-cols-9">
      {deliveryStages.map((stage, i) => (
        <li
          key={stage}
          className="flex items-center gap-3 bg-background px-4 py-4 lg:flex-col lg:items-start lg:gap-6 lg:py-5"
        >
          <span className="font-mono text-xs text-brand">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-medium">{stage}</span>
        </li>
      ))}
    </ol>
  );
}
