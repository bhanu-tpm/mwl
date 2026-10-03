import type { DemoResult } from "@/lib/validation/demo.schema";

/**
 * Curated examples for the AI demo. Selecting one returns this stored answer instantly,
 * with no AI call and no cost, so the demo always works, even without an API key.
 */
export type DemoExample = { id: string; label: string; input: string; result: DemoResult };

export const demoExamples: DemoExample[] = [
  {
    id: "service-requests",
    label: "Customer service requests",
    input:
      "Customers email and call us to raise service requests and ask for updates. Our support team logs them in a shared Excel sheet, and follow-ups are often missed.",
    result: {
      isBusinessProblem: true,
      problemSummary: "Service requests tracked in a shared spreadsheet",
      suggestedSolution:
        "A customer portal where requests are raised, assigned, and tracked in one place, with automatic status updates so customers stop chasing.",
      workflow: [
        { label: "Customer raises request", type: "input" },
        { label: "AI sorts by type & urgency", type: "ai" },
        { label: "Assigned to a technician", type: "system" },
        { label: "Team resolves & updates", type: "human" },
        { label: "Customer notified", type: "output" },
      ],
      benefits: [
        "Every request has an owner and a status",
        "Customers check progress themselves",
        "Fewer missed follow-ups",
        "Clear view of open and overdue requests",
      ],
      considerations: [
        "Customers need a simple login, or a tracking link sent by email",
        "Urgency rules should be agreed with the support team first",
      ],
      solutionCategory: "portal",
    },
  },
  {
    id: "whatsapp-orders",
    label: "WhatsApp orders",
    input:
      "Our sales team gets customer orders on WhatsApp. Someone copies each order into an Excel sheet, and customers keep calling to ask if their order has shipped.",
    result: {
      isBusinessProblem: true,
      problemSummary: "Orders arrive on WhatsApp and are tracked in Excel",
      suggestedSolution:
        "Capture WhatsApp orders into a simple order system that checks stock and price, gets approval, and updates customers automatically.",
      workflow: [
        { label: "WhatsApp order", type: "input" },
        { label: "AI reads the order", type: "ai" },
        { label: "Stock & price check", type: "system" },
        { label: "Sales confirms", type: "human" },
        { label: "Customer auto-updated", type: "output" },
      ],
      benefits: [
        "Every order tracked in one place",
        "Fewer quantity and price mistakes",
        "Customers get status without calling",
        "Live view of pending orders",
      ],
      considerations: [
        "Requires a WhatsApp Business account connected through an approved provider",
      ],
      solutionCategory: "automation",
    },
  },
  {
    id: "approvals",
    label: "Slow approvals",
    input:
      "Purchase requests go by email to the manager and then to finance. They often get stuck for days and nobody knows who has them.",
    result: {
      isBusinessProblem: true,
      problemSummary: "Purchase approvals stuck in email",
      suggestedSolution:
        "A simple approval app where requests follow fixed rules, reminders go out automatically, and approvers can act from their phone.",
      workflow: [
        { label: "Request submitted", type: "input" },
        { label: "Routed by amount", type: "system" },
        { label: "Manager approves", type: "human" },
        { label: "Finance approves", type: "human" },
        { label: "PO issued", type: "output" },
      ],
      benefits: [
        "Everyone can see where a request is",
        "Automatic reminders stop delays",
        "Approve from phone in one tap",
        "Complete approval history for audits",
      ],
      considerations: ["Approval rules and limits need to be agreed with management first"],
      solutionCategory: "business-app",
    },
  },
  {
    id: "policies",
    label: "Answering staff questions",
    input:
      "Our HR team answers the same questions about leave, travel and reimbursement policies every day. The answers are in PDFs that nobody reads.",
    result: {
      isBusinessProblem: true,
      problemSummary: "Repeated policy questions answered by hand",
      suggestedSolution:
        "A private AI assistant that answers staff questions from your approved policy documents and shows the source for every answer.",
      workflow: [
        { label: "Employee asks", type: "input" },
        { label: "Search policy PDFs", type: "system" },
        { label: "AI answers with source", type: "ai" },
        { label: "HR handles unclear cases", type: "human" },
        { label: "Answer delivered", type: "output" },
      ],
      benefits: [
        "Instant answers, any time",
        "Every answer links to its source",
        "HR time freed for real issues",
        "Faster onboarding for new staff",
      ],
      considerations: [
        "Policy documents must be current; outdated PDFs give outdated answers",
      ],
      solutionCategory: "knowledge",
    },
  },
];

const normalise = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/** Exact (whitespace- and case-insensitive) match against a curated example. */
export function findExample(input: string) {
  const n = normalise(input);
  return demoExamples.find((e) => normalise(e.input) === n);
}
