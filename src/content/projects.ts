// Minimal project data for the home page. Phase 3 expands this into the full portfolio system.

export type ProjectSummary = {
  slug: string;
  name: string;
  /** Honest label: never present internal work as client work. */
  label: "Portfolio Project" | "Portfolio / Founder Project" | "Client Project";
  tagline: string;
  summary: string;
  tags: string[];
};

export const projects: ProjectSummary[] = [
  {
    slug: "companybrain-ai",
    name: "CompanyBrainAI",
    label: "Portfolio / Founder Project",
    tagline:
      "An AI-powered company knowledge and business intelligence platform.",
    summary:
      "Brings a company's documents, policies, and business data into one place, so teams can ask questions in plain language and get answers with sources.",
    tags: ["AI knowledge assistant", "Document Q&A", "Business intelligence"],
  },
];
