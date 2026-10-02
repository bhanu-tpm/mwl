import { PlusIcon } from "lucide-react";

/** Native <details> accordion: accessible and zero client JavaScript. */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y border-y">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <PlusIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
            />
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
