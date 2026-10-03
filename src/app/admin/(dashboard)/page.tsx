import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/auth/dal";
import { cn } from "@/lib/utils";
import { leadStatusLabels, leadStatuses, type Lead, type LeadStatus } from "@/lib/validation/admin.schema";

export const metadata = { title: "Leads" };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function LeadsPage({ searchParams }: PageProps<"/admin">) {
  const { db } = await requireAdmin();
  const { status: statusParam } = await searchParams;
  const status = leadStatuses.includes(statusParam as LeadStatus) ? (statusParam as LeadStatus) : null;

  let query = db
    .from("leads")
    .select("id, name, email, company, problem_description, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);

  const [{ data: leads, error }, { data: all }] = await Promise.all([
    query,
    db.from("leads").select("status"),
  ]);

  const counts = Object.fromEntries(leadStatuses.map((s) => [s, 0])) as Record<LeadStatus, number>;
  (all ?? []).forEach((l: { status: LeadStatus }) => counts[l.status]++);
  const total = all?.length ?? 0;

  const filters: { label: string; href: string; count: number; active: boolean }[] = [
    { label: "All", href: "/admin", count: total, active: !status },
    ...leadStatuses.map((s) => ({ label: leadStatusLabels[s], href: `/admin?status=${s}`, count: counts[s], active: status === s })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enquiries from the contact form, newest first.</p>
        </div>
      </div>

      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            aria-current={f.active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
              f.active ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/30",
            )}
          >
            {f.label}
            <span className={cn("font-mono text-xs", f.active ? "opacity-80" : "text-muted-foreground")}>{f.count}</span>
          </Link>
        ))}
      </nav>

      <div className="card-elevated mt-6 overflow-hidden">
        {error ? (
          <p className="p-8 text-sm text-destructive">Couldn&apos;t load leads: {error.message}</p>
        ) : !leads?.length ? (
          <div className="p-10 text-center">
            <p className="font-medium">{status ? `No ${leadStatusLabels[status].toLowerCase()} leads.` : "No enquiries yet."}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New enquiries from the contact form appear here, and you&apos;ll get an email for each one.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {(leads as Pick<Lead, "id" | "name" | "email" | "company" | "problem_description" | "source" | "status" | "created_at">[]).map((lead) => (
              <li key={lead.id}>
                <Link href={`/admin/leads/${lead.id}`} className="grid gap-2 px-5 py-4 transition-colors hover:bg-muted/50 sm:grid-cols-[minmax(0,14rem)_1fr_auto] sm:items-center sm:gap-6">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lead.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{lead.company || lead.email}</p>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{lead.problem_description}</p>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                    <StatusBadge status={lead.status} />
                    <time dateTime={lead.created_at} className="text-xs whitespace-nowrap text-muted-foreground">
                      {dateFmt.format(new Date(lead.created_at))}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
