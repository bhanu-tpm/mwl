import { z } from "zod";

// Option lists are shared by the form UI and the server-side schema, so they can't drift apart.

export const companySizeOptions = [
  { value: "1-10", label: "1–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "201-1000", label: "201–1,000 people" },
  { value: "1000+", label: "1,000+ people" },
] as const;

export const industryOptions = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "trading-distribution", label: "Trading & distribution" },
  { value: "retail-ecommerce", label: "Retail & e-commerce" },
  { value: "logistics", label: "Logistics & transport" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "professional-services", label: "Professional services" },
  { value: "real-estate-construction", label: "Real estate & construction" },
  { value: "finance", label: "Finance & insurance" },
  { value: "hospitality", label: "Hospitality & travel" },
  { value: "other", label: "Other" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3m", label: "Within 1–3 months" },
  { value: "3-6m", label: "Within 3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const budgetOptions = [
  { value: "under-2l", label: "Under ₹2 lakh (~US$2,400)" },
  { value: "2-5l", label: "₹2–5 lakh (~US$2,400–6,000)" },
  { value: "5-15l", label: "₹5–15 lakh (~US$6,000–18,000)" },
  { value: "15l-plus", label: "₹15 lakh+ (~US$18,000+)" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

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
