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
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Written in the business owner's words, not ours. */
export const businessProblems: BusinessProblem[] = [
  {
    title: "Everything runs on Excel",
    description:
      "Critical processes live in spreadsheets that are emailed around, overwritten, and understood by one person.",
    icon: FileSpreadsheetIcon,
  },
  {
    title: "Repetitive data entry",
    description:
      "Staff retype the same orders, invoices, and details from one system into another every day.",
    icon: ClipboardListIcon,
  },
  {
    title: "Information is scattered",
    description:
      "Answers are buried in PDFs, shared drives, and old email threads. Finding them takes longer than the work.",
    icon: FolderSearchIcon,
  },
  {
    title: "Work happens on WhatsApp",
    description:
      "Orders, approvals, and updates arrive in chat groups, so nothing is tracked and things slip.",
    icon: MessagesSquareIcon,
  },
  {
    title: "Approvals take days",
    description:
      "Requests wait in someone's inbox. Nobody knows who has it or why it's stuck.",
    icon: HourglassIcon,
  },
  {
    title: "No clear view of the business",
    description:
      "Management reports are built by hand at month-end, so decisions are made on old numbers.",
    icon: EyeOffIcon,
  },
  {
    title: "Customers keep asking for status",
    description:
      "Your team spends hours answering “where is my order?” instead of doing the work.",
    icon: BellRingIcon,
  },
];
