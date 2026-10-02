import {
  BellRingIcon,
  ClipboardListIcon,
  EyeOffIcon,
  FileSpreadsheetIcon,
  FolderSearchIcon,
  HourglassIcon,
  MessagesSquareIcon,
  type LucideIcon,
} from "lucide-react";

export type BusinessProblem = {
  /** Stable id, also used to pre-fill the contact form (?problems=excel,approvals). */
  id: string;
  title: string;
  description: string;
  /** One-line answer shown when the visitor selects the problem. */
  fix: string;
  /** Anchor on /solutions that covers this fix. */
  solutionId: string;
  icon: LucideIcon;
};

/** Written in the business owner's words, not ours. */
export const businessProblems: BusinessProblem[] = [
  {
    id: "excel",
    title: "Everything runs on Excel",
    description:
      "Critical processes live in spreadsheets that are emailed around, overwritten, and understood by one person.",
    fix: "One shared application with live data, user roles, and a full history of changes.",
    solutionId: "custom-business-applications",
    icon: FileSpreadsheetIcon,
  },
  {
    id: "data-entry",
    title: "Repetitive data entry",
    description:
      "Staff retype the same orders, invoices, and details from one system into another every day.",
    fix: "AI reads documents and messages, then fills your systems automatically for a quick check.",
    solutionId: "ai-business-automation",
    icon: ClipboardListIcon,
  },
  {
    id: "scattered-info",
    title: "Information is scattered",
    description:
      "Answers are buried in PDFs, shared drives, and old email threads. Finding them takes longer than the work.",
    fix: "A private AI assistant that answers from your own documents, with the source for every answer.",
    solutionId: "ai-knowledge-systems",
    icon: FolderSearchIcon,
  },
  {
    id: "whatsapp",
    title: "Work happens on WhatsApp",
    description:
      "Orders, approvals, and updates arrive in chat groups, so nothing is tracked and things slip.",
    fix: "Messages captured into a tracked workflow, so every request has an owner and a status.",
    solutionId: "ai-business-automation",
    icon: MessagesSquareIcon,
  },
  {
    id: "approvals",
    title: "Approvals take days",
    description:
      "Requests wait in someone's inbox. Nobody knows who has it or why it's stuck.",
    fix: "Digital approvals with reminders and escalation, approved from phone in one tap.",
    solutionId: "ai-business-automation",
    icon: HourglassIcon,
  },
  {
    id: "visibility",
    title: "No clear view of the business",
    description:
      "Management reports are built by hand at month-end, so decisions are made on old numbers.",
    fix: "Live dashboards built from your real operational data, always up to date.",
    solutionId: "custom-business-applications",
    icon: EyeOffIcon,
  },
  {
    id: "status-calls",
    title: "Customers keep asking for status",
    description:
      "Your team spends hours answering “where is my order?” instead of doing the work.",
    fix: "A customer portal with live status and automatic updates, so customers stop calling.",
    solutionId: "customer-operations-portals",
    icon: BellRingIcon,
  },
];

/** Turns `?problems=excel,approvals` into a starting sentence for the contact form. */
export function problemsToEnquiry(ids: string[]): string {
  const titles = businessProblems.filter((p) => ids.includes(p.id)).map((p) => p.title);
  if (titles.length === 0) return "";
  return `We're dealing with: ${titles.join("; ")}.\n\n`;
}
