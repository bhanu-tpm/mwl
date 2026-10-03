import { z } from "zod";
import { DEMO_INPUT_MAX, DEMO_INPUT_MIN, solutionCategories, workflowStepTypes } from "./demo.constants";

export { DEMO_INPUT_MAX, DEMO_INPUT_MIN, solutionCategories, workflowStepTypes };


export const demoInputSchema = z.object({
  input: z
    .string({ error: "Please describe the process in a sentence or two." })
    .trim()
    .min(DEMO_INPUT_MIN, `Please describe the process in at least ${DEMO_INPUT_MIN} characters.`)
    .max(DEMO_INPUT_MAX, `Please keep it under ${DEMO_INPUT_MAX} characters.`),
});


/** Output contract for the AI demo (docs/ai-architecture.md). Every model response is checked against it. */
export const demoResultSchema = z.object({
  isBusinessProblem: z
    .boolean()
    .describe("False if the text is not a description of a business process or problem."),
  problemSummary: z.string().max(160).describe("The current problem in a few words."),
  suggestedSolution: z.string().max(320).describe("The suggested solution in one sentence."),
  workflow: z
    .array(
      z.object({
        label: z.string().max(60).describe("Short step name, 2–4 words."),
        type: z.enum(workflowStepTypes),
      }),
    )
    .max(8)
    .describe("3–7 steps from input to result. Include at least one 'human' review step."),
  benefits: z.array(z.string().max(160)).max(5).describe("3–4 practical business benefits."),
  considerations: z
    .array(z.string().max(200))
    .max(3)
    .describe("1–2 honest things to check, such as data access or edge cases."),
  solutionCategory: z.enum(solutionCategories),
});

export type DemoResult = z.infer<typeof demoResultSchema>;

export type DemoErrorCode =
  | "invalid_input"
  | "rate_limited"
  | "daily_limit"
  | "unavailable"
  | "not_configured";

export type DemoResponse =
  | { status: "ok"; source: "example" | "ai"; result: DemoResult }
  | { status: "error"; code: DemoErrorCode; message: string };
