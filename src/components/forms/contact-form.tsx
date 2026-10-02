"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2Icon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLead, type ContactFormState } from "@/app/(marketing)/contact/actions";
import {
  budgetOptions,
  companySizeOptions,
  industryOptions,
  timelineOptions,
} from "@/lib/validation/lead.schema";
import { siteConfig } from "@/config/site";
import { FormField, NativeSelect, controlClassName } from "./form-field";

const initialState: ContactFormState = { status: "idle" };

const optionalDetailFields = [
  "companySize",
  "industry",
  "timeline",
  "budget",
  "additionalInfo",
] as const;

export function ContactForm({ defaultProblem = "" }: { defaultProblem?: string }) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};

  // Move focus to the first invalid field, or to the status message.
  useEffect(() => {
    if (state.status === "idle") return;
    const firstInvalid = document.querySelector<HTMLElement>("form [aria-invalid=true]");
    (firstInvalid ?? statusRef.current)?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border bg-card p-8 outline-none sm:p-10"
      >
        <CheckCircle2Icon aria-hidden="true" className="size-8 text-brand" />
        <h2 className="text-h3 mt-5 text-2xl">Thank you. We&apos;ve received your message.</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We read every enquiry personally and will reply within one business
          day, usually with a few questions to understand your process better.
        </p>
      </div>
    );
  }

  const detailsOpen = optionalDetailFields.some((f) => e[f] || v[f]);

  return (
    <form action={formAction} className="space-y-10">
      {state.status === "error" && state.message && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm outline-none"
        >
          {state.message}{" "}
          {!state.fieldErrors && (
            <a href={`mailto:${siteConfig.contact.email}`} className="font-medium underline">
              {siteConfig.contact.email}
            </a>
          )}
        </div>
      )}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-6">
        <legend className="eyebrow mb-6">1 · Your business problem</legend>
        <FormField
          id="problem"
          label="What business problem are you trying to solve?"
          required
          hint="Plain language is perfect. For example: “We process 300 invoices a month by hand.”"
          error={e.problem}
        >
          {(p) => (
            <Textarea
              {...p}
              required
              minLength={20}
              maxLength={3000}
              rows={5}
              defaultValue={v.problem ?? defaultProblem}
              className="min-h-36 bg-card text-base md:text-sm"
            />
          )}
        </FormField>
        <FormField
          id="currentProcess"
          label="How is this handled today?"
          hint="Tools, people, and steps involved: Excel, WhatsApp, email, paper…"
          error={e.currentProcess}
        >
          {(p) => (
            <Textarea
              {...p}
              maxLength={2000}
              rows={3}
              defaultValue={v.currentProcess}
              className="min-h-24 bg-card text-base md:text-sm"
            />
          )}
        </FormField>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="eyebrow mb-6">2 · About you</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id="name" label="Name" required error={e.name}>
            {(p) => (
              <Input {...p} required autoComplete="name" maxLength={100} defaultValue={v.name} className={controlClassName} />
            )}
          </FormField>
          <FormField id="email" label="Work email" required error={e.email}>
            {(p) => (
              <Input {...p} type="email" required autoComplete="email" maxLength={200} defaultValue={v.email} className={controlClassName} />
            )}
          </FormField>
          <FormField id="company" label="Company" error={e.company}>
            {(p) => (
              <Input {...p} autoComplete="organization" maxLength={150} defaultValue={v.company} className={controlClassName} />
            )}
          </FormField>
          <FormField id="phone" label="Phone / WhatsApp" error={e.phone}>
            {(p) => (
              <Input {...p} type="tel" autoComplete="tel" maxLength={30} defaultValue={v.phone} className={controlClassName} />
            )}
          </FormField>
        </div>
      </fieldset>

      <details open={detailsOpen} className="group rounded-xl border bg-card/50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-5 font-medium [&::-webkit-details-marker]:hidden">
          <span>
            3 · More context{" "}
            <span className="font-normal text-muted-foreground">
              (optional, helps us prepare)
            </span>
          </span>
          <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="grid gap-6 border-t p-5 sm:grid-cols-2">
          <FormField id="companySize" label="Company size" error={e.companySize}>
            {(p) => <NativeSelect {...p} options={companySizeOptions} defaultValue={v.companySize ?? ""} />}
          </FormField>
          <FormField id="industry" label="Industry" error={e.industry}>
            {(p) => <NativeSelect {...p} options={industryOptions} defaultValue={v.industry ?? ""} />}
          </FormField>
          <FormField id="timeline" label="Desired timeline" error={e.timeline}>
            {(p) => <NativeSelect {...p} options={timelineOptions} defaultValue={v.timeline ?? ""} />}
          </FormField>
          <FormField id="budget" label="Approximate budget" error={e.budget}>
            {(p) => <NativeSelect {...p} options={budgetOptions} defaultValue={v.budget ?? ""} />}
          </FormField>
          <FormField id="additionalInfo" label="Anything else?" error={e.additionalInfo} className="sm:col-span-2">
            {(p) => (
              <Textarea {...p} maxLength={2000} rows={3} defaultValue={v.additionalInfo} className="min-h-24 bg-card text-base md:text-sm" />
            )}
          </FormField>
        </div>
      </details>

      <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          We use your details only to reply to this enquiry. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>.
        </p>
        <Button type="submit" variant="brand" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
