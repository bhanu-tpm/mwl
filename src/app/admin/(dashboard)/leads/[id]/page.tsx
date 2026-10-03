import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, MailIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadUpdateForm } from "@/components/admin/lead-update-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/auth/dal";
import type { Lead } from "@/lib/validation/admin.schema";
import { budgetOptions, companySizeOptions, industryOptions, timelineOptions } from "@/lib/validation/lead.schema";

export const metadata = { title: "Lead" };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" });
const label = (opts: readonly { value: string; label: string }[], v: string | null) =>
  v ? (opts.find((o) => o.value === v)?.label ?? v) : null;

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await db.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  const facts: [string, string | null][] = [
    ["Email", lead.email],
    ["Phone / WhatsApp", lead.phone],
    ["Company", lead.company],
    ["Company size", label(companySizeOptions, lead.company_size)],
    ["Industry", label(industryOptions, lead.industry)],
    ["Timeline", label(timelineOptions, lead.timeline)],
    ["Budget", label(budgetOptions, lead.budget)],
    ["Source", lead.source === "ai_demo" ? "AI demo" : "Contact form"],
    ["Received", dateFmt.format(new Date(lead.created_at))],
  ];
  const whatsapp = lead.phone?.replace(/[^\d]/g, "");

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        All leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="mt-1 text-muted-foreground">{lead.company || lead.email}</p>
        </div>
        <StatusBadge status={lead.status} className="text-sm" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="card-elevated p-6">
            <h2 className="eyebrow">Business problem</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-wrap">{lead.problem_description}</p>
            {lead.current_process && (
              <>
                <h2 className="eyebrow mt-6">How it&apos;s handled today</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-wrap">{lead.current_process}</p>
              </>
            )}
            {lead.additional_info && (
              <>
                <h2 className="eyebrow mt-6">Anything else</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-wrap">{lead.additional_info}</p>
              </>
            )}
          </section>

          <section className="card-elevated p-6">
            <h2 className="eyebrow">Follow-up</h2>
            <LeadUpdateForm id={lead.id} status={lead.status} notes={lead.notes ?? ""} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card-elevated p-6">
            <h2 className="eyebrow">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <div className="flex flex-col gap-2">
            <Button asChild size="lg">
              <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Your enquiry with Mithila Web Labs")}`}>
                <MailIcon data-icon="inline-start" />
                Reply by email
              </a>
            </Button>
            {whatsapp && whatsapp.length >= 10 && (
              <Button asChild variant="outline" size="lg" className="bg-card">
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircleIcon data-icon="inline-start" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
