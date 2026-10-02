/** The detailed 9-stage delivery flow, shown on the home page. */
export const deliveryStages = [
  "Discovery",
  "Process Mapping",
  "Solution Design",
  "Prototype",
  "Development",
  "AI Integration",
  "Testing",
  "Deployment",
  "Support",
] as const;

export type EngagementStep = {
  title: string;
  summary: string;
  whatHappens: string[];
  youGet: string;
  /** Which of the 9 delivery stages this step covers. */
  stages: (typeof deliveryStages)[number][];
};

/** The 7-step engagement model, shown on /how-we-work. */
export const engagementSteps: EngagementStep[] = [
  {
    title: "Understand",
    summary: "We learn how your business works and where the real pain is.",
    whatHappens: [
      "A conversation with the people who own the problem",
      "Clarify goals, constraints, and what success looks like",
    ],
    youGet: "A clear problem statement both sides agree on.",
    stages: ["Discovery"],
  },
  {
    title: "Map",
    summary: "We document the current workflow step by step.",
    whatHappens: [
      "Walk through the process with the team that does it today",
      "Identify delays, manual steps, and data sources",
    ],
    youGet: "A current-process map showing where time is lost.",
    stages: ["Process Mapping"],
  },
  {
    title: "Design",
    summary: "We design the simplest solution that solves the problem.",
    whatHappens: [
      "Decide what to automate, what to build, and where AI genuinely helps",
      "Agree scope, timeline, and cost before development starts",
    ],
    youGet: "A solution design with a fixed scope for the first release.",
    stages: ["Solution Design"],
  },
  {
    title: "Prototype",
    summary: "You see and use a working version early.",
    whatHappens: [
      "A clickable or working prototype of the core workflow",
      "Feedback from real users before full development",
    ],
    youGet: "Confidence that we are building the right thing.",
    stages: ["Prototype"],
  },
  {
    title: "Develop",
    summary: "We build production-quality software in short iterations.",
    whatHappens: [
      "Regular demos so you can see progress",
      "AI features integrated and tested against your real data",
      "Security, testing, and documentation built in from the start",
    ],
    youGet: "Working software you can review every one to two weeks.",
    stages: ["Development", "AI Integration", "Testing"],
  },
  {
    title: "Deploy",
    summary: "We launch carefully and monitor closely.",
    whatHappens: [
      "Deployment to secure cloud infrastructure",
      "Team onboarding and handover documentation",
    ],
    youGet: "A live system your team knows how to use.",
    stages: ["Deployment"],
  },
  {
    title: "Improve",
    summary: "We refine based on how the business actually uses it.",
    whatHappens: [
      "Review usage and feedback after launch",
      "Prioritise the next improvements by business value",
    ],
    youGet: "Software that keeps getting more useful.",
    stages: ["Support"],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Do we need to know exactly what we want before contacting you?",
    answer:
      "No. Most conversations start with a problem, not a specification. Working out the right solution is part of our job.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A focused first release usually takes 4–10 weeks, depending on scope. We prefer to deliver something useful quickly, then improve it.",
  },
  {
    question: "Do we have to use AI?",
    answer:
      "No. We recommend AI only where it clearly saves time or improves quality. Many problems are best solved with a well-designed application and simple automation.",
  },
  {
    question: "Who owns the software and the data?",
    answer:
      "You do. Your source code, data, and accounts belong to your business, and we document everything so you are never locked in.",
  },
  {
    question: "Do you work with businesses outside India?",
    answer:
      "Yes. We work remotely and are expanding our work with businesses in the UAE and the wider GCC.",
  },
  {
    question: "How is pricing decided?",
    answer:
      "After the Design step we agree a fixed scope and price for the first release, so there are no open-ended bills.",
  },
];
