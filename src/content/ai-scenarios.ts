import {
  CalculatorIcon,
  FactoryIcon,
  PackageIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * Illustrative AI runs by industry for the home page "AI in practice" section.
 * Values are realistic examples, not client data; the UI labels them as illustrative.
 * Pattern (industry best practice): AI handles volume, people decide on exceptions,
 * low-confidence results are routed to a person, every step is logged.
 */
export type AiScenario = {
  id: string;
  industry: string;
  icon: LucideIcon;
  process: string;
  input: { channel: string; content: string };
  extracted: { field: string; value: string; confidence: number }[];
  checks: { label: string; ok: boolean }[];
  review: { who: string; reason: string; decision: string };
  result: string[];
  aiDoes: string[];
  teamDoes: string[];
};

/** Fields below this confidence are sent to a person instead of being auto-accepted. */
export const REVIEW_THRESHOLD = 90;

export const aiScenarios: AiScenario[] = [
  {
    id: "distribution",
    industry: "Trading & Distribution",
    icon: PackageIcon,
    process: "Order capture from WhatsApp",
    input: {
      channel: "WhatsApp · Sharma Traders",
      content:
        "Bhai 120 pcs PVC pipe 2 inch aur 300 elbow bhej do Friday tak. Rate same as last time.",
    },
    extracted: [
      { field: "Customer", value: "Sharma Traders, Pune", confidence: 99 },
      { field: "Items", value: "PVC pipe 2″ × 120 · Elbow × 300", confidence: 96 },
      { field: "Delivery", value: "Fri, 10 Oct", confidence: 94 },
      { field: "Rate", value: "Last invoice rate", confidence: 82 },
    ],
    checks: [
      { label: "Stock available", ok: true },
      { label: "Price list matched", ok: true },
      { label: "Credit limit", ok: false },
    ],
    review: {
      who: "Sales head",
      reason: "Order exceeds credit limit by ₹18,400",
      decision: "Approved on phone, one tap",
    },
    result: ["Sales order created in your system", "Customer confirmed on WhatsApp", "Dispatch team notified"],
    aiDoes: ["Reads mixed Hindi–English messages", "Creates the draft order", "Checks stock, price, and credit"],
    teamDoes: ["Approves credit exceptions", "Handles special rates", "Talks to the customer"],
  },
  {
    id: "manufacturing",
    industry: "Manufacturing",
    icon: FactoryIcon,
    process: "Supplier invoice matching",
    input: {
      channel: "Email · accounts@ inbox",
      content: "INV-2291.pdf from Shree Polymers — 2,000 kg HDPE granules, GST invoice attached.",
    },
    extracted: [
      { field: "Supplier GSTIN", value: "27ABCDE1234F1Z5", confidence: 99 },
      { field: "HSN / Qty", value: "3901 · 2,000 kg", confidence: 97 },
      { field: "Taxable value", value: "₹2,36,000", confidence: 98 },
      { field: "PO reference", value: "PO-0418 (handwritten)", confidence: 78 },
    ],
    checks: [
      { label: "Matches purchase order", ok: true },
      { label: "Matches goods receipt (GRN)", ok: false },
      { label: "GST details valid", ok: true },
    ],
    review: {
      who: "Accounts executive",
      reason: "GRN shows 1,950 kg received, invoice says 2,000 kg",
      decision: "Short-supply debit note raised",
    },
    result: ["Purchase entry posted", "Debit note sent to supplier", "GST input credit recorded"],
    aiDoes: ["Reads PDF and scanned invoices", "Matches invoice, PO, and GRN", "Flags quantity and rate gaps"],
    teamDoes: ["Resolves mismatches", "Talks to suppliers", "Approves payments"],
  },
  {
    id: "logistics",
    industry: "Logistics",
    icon: TruckIcon,
    process: "Proof of delivery & exceptions",
    input: {
      channel: "Driver app · photo upload",
      content: "Signed delivery challan photo — LR 77812, Bhiwandi → Nashik, 42 cartons.",
    },
    extracted: [
      { field: "LR number", value: "77812", confidence: 99 },
      { field: "Cartons received", value: "40 of 42", confidence: 93 },
      { field: "Receiver remark", value: "“2 box damaged”", confidence: 85 },
      { field: "Signed by", value: "R. Patil, store", confidence: 91 },
    ],
    checks: [
      { label: "LR matches e-way bill", ok: true },
      { label: "Quantity complete", ok: false },
      { label: "Delivered on time", ok: true },
    ],
    review: {
      who: "Operations manager",
      reason: "Short and damaged delivery reported",
      decision: "Claim opened with photos attached",
    },
    result: ["Shipment marked delivered (partial)", "Customer updated automatically", "Damage claim created"],
    aiDoes: ["Reads challans and handwriting", "Updates shipment status", "Spots short or damaged deliveries"],
    teamDoes: ["Decides on claims", "Speaks to customers", "Manages carriers"],
  },
  {
    id: "accounting",
    industry: "Accounting & CA Firms",
    icon: CalculatorIcon,
    process: "Bank statement to ledger",
    input: {
      channel: "Client upload · bank statement",
      content: "HDFC current account statement, September — 312 transactions, PDF.",
    },
    extracted: [
      { field: "Transactions read", value: "312 of 312", confidence: 99 },
      { field: "Auto-categorised", value: "287 entries", confidence: 95 },
      { field: "Vendor matches", value: "41 bills linked", confidence: 92 },
      { field: "Unclear entries", value: "25 (UPI, cash)", confidence: 70 },
    ],
    checks: [
      { label: "Opening balance matches", ok: true },
      { label: "Duplicates found", ok: true },
      { label: "All entries categorised", ok: false },
    ],
    review: {
      who: "Article assistant",
      reason: "25 UPI and cash entries need a ledger",
      decision: "Assigned in 15 minutes, partner signs off",
    },
    result: ["Ledger entries ready to import", "Reconciliation report", "Client queries list sent"],
    aiDoes: ["Reads statements from any bank", "Categorises routine entries", "Matches bills and receipts"],
    teamDoes: ["Classifies unclear entries", "Reviews and signs off", "Advises the client"],
  },
];

export const autonomyLadder = [
  {
    step: "Assist",
    title: "AI suggests, people act",
    description: "Drafts, summaries, and suggested entries. Nothing changes without a person.",
  },
  {
    step: "Automate with review",
    title: "AI acts, people approve exceptions",
    description: "Routine work flows through automatically. Anything unusual or low-confidence goes to a person.",
  },
  {
    step: "Automate within rules",
    title: "AI acts inside clear limits",
    description: "Proven, low-risk steps run on their own, with limits, alerts, and a full audit trail.",
  },
];

export const aiGuardrails = [
  { title: "Confidence thresholds", description: "Uncertain results go to a person, never straight into your books." },
  { title: "Full audit trail", description: "Every AI action is logged: what it read, what it did, who approved." },
  { title: "Your data stays private", description: "Access controls, private storage, and AI settings chosen so your data isn’t used for training." },
];
