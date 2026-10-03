import { z } from "zod";

import {
  budgetOptions,
  companySizeOptions,
  industryOptions,
  timelineOptions,
} from "./lead.options";

export { budgetOptions, companySizeOptions, industryOptions, timelineOptions };

type Options = readonly { value: string }[];
const values = <T extends Options>(opts: T) =>
  opts.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

/** Empty form fields arrive as "" — treat them as "not provided". */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

const optionalEnum = <T extends Options>(opts: T) =>
  z
    .union([z.literal(""), z.enum(values(opts))])
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").trim().max(200),
  problem: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(3000, "Please keep this under 3,000 characters."),
  company: optionalText(150),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s()-]*$/, "Please enter a valid phone number.")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  companySize: optionalEnum(companySizeOptions),
  industry: optionalEnum(industryOptions),
  currentProcess: optionalText(2000),
  timeline: optionalEnum(timelineOptions),
  budget: optionalEnum(budgetOptions),
  additionalInfo: optionalText(2000),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadField = keyof LeadInput;
