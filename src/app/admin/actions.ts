"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/dal";
import { getUserDb } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/validation/admin.schema";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.email().trim().max(200),
  password: z.string().min(1).max(200),
});

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: "Enter your email and password.", email };

  const db = await getUserDb();
  if (!db) return { error: "Admin login isn't configured on this server.", email };

  // One generic message for every failure, so the form doesn't reveal which emails exist
  // or which accounts are admins.
  const denied = { error: "That email and password don't match an admin account.", email };
  const { error } = await db.auth.signInWithPassword(parsed.data);
  if (error) return denied;

  const { data: isAdmin } = await db.rpc("is_admin");
  if (!isAdmin) {
    await db.auth.signOut();
    return denied;
  }

  redirect("/admin");
}

export async function signOut() {
  const db = await getUserDb();
  await db?.auth.signOut();
  redirect("/admin/login");
}

const updateLeadSchema = z.object({
  id: z.uuid(),
  status: z.enum(leadStatuses),
  notes: z.string().trim().max(5000),
});

export type UpdateLeadState = { ok?: boolean; error?: string };

export async function updateLead(_prev: UpdateLeadState, formData: FormData): Promise<UpdateLeadState> {
  const { db } = await requireAdmin();
  const parsed = updateLeadSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "Please check the status and notes." };

  // Runs as the signed-in admin, so RLS applies as well.
  const { error } = await db
    .from("leads")
    .update({ status: parsed.data.status, notes: parsed.data.notes || null })
    .eq("id", parsed.data.id);
  if (error) return { error: "Couldn't save. Please try again." };

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${parsed.data.id}`);
  return { ok: true };
}
