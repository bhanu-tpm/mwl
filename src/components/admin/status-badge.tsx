import { cn } from "@/lib/utils";
import { leadStatusLabels, type LeadStatus } from "@/lib/validation/admin.schema";

const styles: Record<LeadStatus, string> = {
  new: "bg-brand text-brand-foreground",
  contacted: "bg-sky-100 text-sky-900",
  discovery: "bg-violet-100 text-violet-900",
  proposal: "bg-amber-100 text-amber-900",
  won: "bg-emerald-100 text-emerald-900",
  lost: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status], className)}>
      {leadStatusLabels[status]}
    </span>
  );
}
