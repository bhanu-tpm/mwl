/** Mirrors the `lead_status` enum in supabase/migrations. */
export const leadStatuses = ["new", "contacted", "discovery", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  discovery: "Discovery",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  company_size: string | null;
  industry: string | null;
  problem_description: string;
  current_process: string | null;
  timeline: string | null;
  budget: string | null;
  additional_info: string | null;
  source: "contact_form" | "ai_demo";
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
