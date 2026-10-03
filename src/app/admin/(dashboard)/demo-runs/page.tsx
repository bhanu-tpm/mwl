import { requireAdmin } from "@/lib/auth/dal";
import { cn } from "@/lib/utils";

export const metadata = { title: "AI demo runs" };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

type Run = {
  id: string;
  input: string;
  status: "success" | "error" | "rate_limited" | "rejected";
  error_kind: string | null;
  output: { problemSummary?: string; solutionCategory?: string } | null;
  input_tokens: number | null;
  output_tokens: number | null;
  latency_ms: number | null;
  created_at: string;
};

const statusStyle: Record<Run["status"], string> = {
  success: "bg-emerald-100 text-emerald-900",
  rejected: "bg-muted text-muted-foreground",
  rate_limited: "bg-amber-100 text-amber-900",
  error: "bg-red-100 text-red-900",
};

/** ISO timestamp for 24 hours ago (kept out of render for purity). */
function dayAgo() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

export default async function DemoRunsPage() {
  const { db } = await requireAdmin();
  const since = dayAgo();
  const [{ data, error }, today] = await Promise.all([
    db
      .from("ai_demo_runs")
      .select("id, input, status, error_kind, output, input_tokens, output_tokens, latency_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    db.from("ai_demo_runs").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);
  const runs = (data ?? []) as Run[];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">AI demo runs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        What visitors typed into the AI demo. {today.count ?? 0} in the last 24 hours. Deleted
        automatically after 90 days.
      </p>

      <div className="card-elevated mt-6 overflow-hidden">
        {error ? (
          <p className="p-8 text-sm text-destructive">Couldn&apos;t load runs: {error.message}</p>
        ) : !runs.length ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No demo runs yet. Prepared examples aren&apos;t logged, only text visitors write themselves.
          </p>
        ) : (
          <ul className="divide-y">
            {runs.map((run) => (
              <li key={run.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm">{run.input}</p>
                  {run.output?.problemSummary && (
                    <p className="mt-1 truncate text-sm text-muted-foreground">→ {run.output.problemSummary}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground sm:flex-col sm:items-end sm:gap-1">
                  <span className={cn("rounded-full px-2 py-0.5 font-medium", statusStyle[run.status])}>
                    {run.status.replace("_", " ")}
                    {run.error_kind ? ` · ${run.error_kind}` : ""}
                  </span>
                  <span className="whitespace-nowrap">
                    {dateFmt.format(new Date(run.created_at))}
                    {run.latency_ms ? ` · ${(run.latency_ms / 1000).toFixed(1)}s` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
