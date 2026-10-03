// Zod-free so client components can import these without shipping the validator.
export const DEMO_INPUT_MIN = 20;
export const DEMO_INPUT_MAX = 600;
export const workflowStepTypes = ["input", "ai", "human", "system", "output"] as const;
export const solutionCategories = ["automation", "business-app", "knowledge", "portal"] as const;
