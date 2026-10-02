import { CheckIcon, MessageSquareTextIcon, SparklesIcon } from "lucide-react";
import { WorkflowChain } from "@/components/sections/workflow-chain";
import type { WorkflowStep } from "@/types/workflow";

// Static worked example. Phase 4 replaces this with the interactive, server-side AI demo.
const example = {
  input:
    "Our sales team receives customer orders through WhatsApp and manually enters them into Excel.",
  problem: "Manual order capture from chat messages",
  solution:
    "AI order extraction with validation and approval, feeding a central order database.",
  workflow: [
    { label: "WhatsApp order", type: "input" },
    { label: "AI order extraction", type: "ai" },
    { label: "Stock & price validation", type: "system" },
    { label: "Sales approval", type: "human" },
    { label: "Order database", type: "system" },
    { label: "Customer notified", type: "output" },
  ] satisfies WorkflowStep[],
  benefits: [
    "No retyping of orders",
    "Fewer pricing and quantity errors",
    "Every order tracked from message to delivery",
  ],
};

export function AiDemoPreview() {
  return (
    <div className="grid overflow-hidden rounded-xl border bg-card lg:grid-cols-2">
      <div className="border-b p-6 sm:p-8 lg:border-e lg:border-b-0">
        <p className="eyebrow flex items-center gap-2">
          <MessageSquareTextIcon aria-hidden="true" className="size-3.5" />
          Business problem
        </p>
        <blockquote className="mt-4 rounded-lg bg-muted p-5 text-lg leading-relaxed">
          &ldquo;{example.input}&rdquo;
        </blockquote>
        <dl className="mt-8 space-y-5 text-sm">
          <div>
            <dt className="eyebrow">Current problem</dt>
            <dd className="mt-1.5 font-medium">{example.problem}</dd>
          </div>
          <div>
            <dt className="eyebrow">Suggested solution</dt>
            <dd className="mt-1.5 font-medium">{example.solution}</dd>
          </div>
          <div>
            <dt className="eyebrow">Potential benefits</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5">
                {example.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
      <div className="bg-muted/50 p-6 sm:p-8">
        <p className="eyebrow flex items-center gap-2">
          <SparklesIcon aria-hidden="true" className="size-3.5" />
          Potential workflow
        </p>
        <WorkflowChain steps={example.workflow} className="mt-4" />
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Illustrative example. Suggestions like this are a starting point for a
          conversation, not professional consulting advice.
        </p>
      </div>
    </div>
  );
}
