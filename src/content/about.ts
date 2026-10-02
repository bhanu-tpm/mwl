import {
  BriefcaseBusinessIcon,
  BrainCircuitIcon,
  CodeXmlIcon,
  LightbulbIcon,
  type LucideIcon,
} from "lucide-react";

export const capabilities: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Business understanding",
    description:
      "We start by learning how your business makes money, where time is lost, and what your team actually needs.",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Product thinking",
    description:
      "We design the simplest thing that solves the problem, and say no to features that don't earn their place.",
    icon: LightbulbIcon,
  },
  {
    title: "Software engineering",
    description:
      "Secure, tested, maintainable code on modern, widely used technology, so your software lasts.",
    icon: CodeXmlIcon,
  },
  {
    title: "Practical AI",
    description:
      "AI where it removes real work: reading documents, answering questions, and spotting patterns. Not AI for its own sake.",
    icon: BrainCircuitIcon,
  },
];

export const principles: { title: string; description: string }[] = [
  {
    title: "Business value first",
    description: "Every feature should save time, reduce errors, or help someone make a better decision.",
  },
  {
    title: "Simple beats clever",
    description: "Simple systems are cheaper to build, easier to use, and easier to maintain.",
  },
  {
    title: "Show, don't tell",
    description: "Working prototypes early, regular demos, and no long silences.",
  },
  {
    title: "Honest by default",
    description: "If something isn't a good fit for software or AI, we'll tell you.",
  },
  {
    title: "You own it",
    description: "Your code, your data, your accounts, all documented, with no lock-in.",
  },
];

export type Founder = {
  name: string;
  role: string;
  bio: string;
  /** Path under /public, e.g. "/images/founder.jpg" */
  photo?: string;
  linkedin?: string;
};

// TODO(founder): add details to show the founder section on /about.
export const founder: Founder | null = null;
