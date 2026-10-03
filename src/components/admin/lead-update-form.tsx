"use client";

import { useActionState } from "react";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/forms/form-field";
import { updateLead, type UpdateLeadState } from "@/app/admin/actions";
import { leadStatusLabels, leadStatuses, type LeadStatus } from "@/lib/validation/admin.schema";

const options = leadStatuses.map((s) => ({ value: s, label: leadStatusLabels[s] }));

export function LeadUpdateForm({ id, status, notes }: { id: string; status: LeadStatus; notes: string }) {
  const [state, action, pending] = useActionState<UpdateLeadState, FormData>(updateLead, {});

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="id" value={id} />
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <NativeSelect id="status" name="status" options={options} defaultValue={status} placeholder="Choose status" required className="max-w-xs" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Private notes</Label>
        <Textarea id="notes" name="notes" defaultValue={notes} maxLength={5000} rows={5} className="bg-card text-base md:text-sm" placeholder="Call notes, next steps, quote sent…" />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
          Save
        </Button>
        <p aria-live="polite" className="text-sm">
          {state.ok && !pending && (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckIcon aria-hidden="true" className="size-4" />
              Saved
            </span>
          )}
          {state.error && <span className="text-destructive">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
