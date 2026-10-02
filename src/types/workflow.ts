/** A step in a business workflow diagram. Shared by marketing content and the AI demo output. */
export type WorkflowStepType = "input" | "ai" | "human" | "system" | "output";

export type WorkflowStep = {
  label: string;
  type: WorkflowStepType;
};
