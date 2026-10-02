import {
  BookOpenTextIcon,
  LayoutDashboardIcon,
  UsersRoundIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";
import type { WorkflowStep } from "@/types/workflow";

export type Solution = {
  /** Used as the page anchor: /solutions#<id> */
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  problem: string;
  approach: string;
  example: {
    scenario: string;
    workflow: WorkflowStep[];
  };
  benefits: string[];
  examples: string[];
};

export const solutions: Solution[] = [
  {
    id: "ai-business-automation",
    title: "AI Business Automation",
    summary:
      "Automate repetitive work like data entry, document handling, approvals, and follow-ups, so your team can focus on decisions.",
    icon: WorkflowIcon,
    problem:
      "Skilled people spend hours copying data between emails, PDFs, spreadsheets, and accounting software. It is slow, error-prone, and does not scale when the business grows.",
    approach:
      "We map the process step by step, then automate the repetitive parts. AI reads and extracts information from documents and messages; rules validate it; people approve only what needs judgement.",
    example: {
      scenario:
        "A distributor receives 200 supplier invoices a month by email and types each one into Excel and Tally.",
      workflow: [
        { label: "Invoice email", type: "input" },
        { label: "AI extracts details", type: "ai" },
        { label: "Validation rules", type: "system" },
        { label: "Manager approval", type: "human" },
        { label: "Accounting entry", type: "output" },
      ],
    },
    benefits: [
      "Hours of manual entry removed every week",
      "Fewer errors and duplicate payments",
      "A full audit trail of who approved what",
    ],
    examples: [
      "Invoice and purchase order processing",
      "Approval workflows",
      "Automated notifications and reminders",
      "Email and WhatsApp order capture",
      "Report generation",
    ],
  },
  {
    id: "custom-business-applications",
    title: "Custom Business Applications",
    summary:
      "Replace spreadsheets and disconnected tools with one application built around how your business actually works.",
    icon: LayoutDashboardIcon,
    problem:
      "Off-the-shelf software forces you to change your process, while spreadsheets break as soon as more than a few people use them.",
    approach:
      "We design a focused web application for your workflow, with roles, permissions, and dashboards, starting with the smallest version that delivers value.",
    example: {
      scenario:
        "A service company tracks 40 field technicians, job sheets, and spare parts across five spreadsheets.",
      workflow: [
        { label: "Job created", type: "input" },
        { label: "Auto-assigned to technician", type: "system" },
        { label: "Mobile job sheet", type: "human" },
        { label: "Parts updated", type: "system" },
        { label: "Live dashboard", type: "output" },
      ],
    },
    benefits: [
      "One source of truth instead of many spreadsheets",
      "Real-time visibility for management",
      "Software that fits your process, not the other way round",
    ],
    examples: [
      "Internal operations platforms",
      "Management dashboards",
      "Workflow and task applications",
      "Inventory and job tracking",
      "Employee self-service apps",
    ],
  },
  {
    id: "ai-knowledge-systems",
    title: "AI Knowledge & Document Systems",
    summary:
      "Let your team ask questions in plain language and get answers from your own documents, policies, and SOPs.",
    icon: BookOpenTextIcon,
    problem:
      "Company knowledge is spread across PDFs, manuals, and shared drives. New employees take months to get up to speed, and experienced staff answer the same questions repeatedly.",
    approach:
      "We build a private AI assistant that searches your approved documents and answers with references to the source, so people can check every answer. Access follows your existing permissions.",
    example: {
      scenario:
        "An HR team answers the same leave, travel, and reimbursement questions from 300 employees every week.",
      workflow: [
        { label: "Employee question", type: "input" },
        { label: "Search approved policies", type: "system" },
        { label: "AI answer with sources", type: "ai" },
        { label: "Escalate if unsure", type: "human" },
        { label: "Answer delivered", type: "output" },
      ],
    },
    benefits: [
      "Instant answers, with sources you can check",
      "Faster onboarding for new staff",
      "Experts freed from repeated questions",
    ],
    examples: [
      "Company knowledge assistants",
      "Document Q&A",
      "SOP and process assistants",
      "Policy assistants",
      "Internal AI search",
    ],
  },
  {
    id: "customer-operations-portals",
    title: "Customer & Operations Portals",
    summary:
      "Give customers and partners a secure place to place requests, track status, and access documents without calling your team.",
    icon: UsersRoundIcon,
    problem:
      "Customers call and message for updates, documents get lost in email, and your team becomes a human status page.",
    approach:
      "We build a secure portal connected to your operations data, so customers can see status, download documents, and raise requests themselves. Your team sees everything in one queue.",
    example: {
      scenario:
        "A logistics company receives 150 “where is my shipment?” calls a day.",
      workflow: [
        { label: "Customer logs in", type: "input" },
        { label: "Live shipment status", type: "system" },
        { label: "Documents & invoices", type: "system" },
        { label: "Service request", type: "human" },
        { label: "Automatic updates", type: "output" },
      ],
    },
    benefits: [
      "Fewer status calls and emails",
      "A more professional customer experience",
      "Requests tracked instead of lost",
    ],
    examples: [
      "Customer self-service portals",
      "Order and shipment tracking",
      "Service request management",
      "Secure document access",
      "Status dashboards for clients",
    ],
  },
];
