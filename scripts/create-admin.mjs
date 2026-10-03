#!/usr/bin/env node
// Creates (or promotes) an admin user. Public sign-up is disabled, so this is the only way in.
// Usage: npm run admin:create            (prompts for email and password)
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local (or the environment).

import { existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.");
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });
const email = (process.env.ADMIN_EMAIL ?? (await rl.question("Admin email: "))).trim().toLowerCase();
let password = process.env.ADMIN_PASSWORD;
if (!password) {
  // Hide the password while typing.
  stdout.write("Password (12+ characters, letters and numbers): ");
  const original = rl._writeToOutput;
  rl._writeToOutput = () => {};
  password = await rl.question("");
  rl._writeToOutput = original;
  stdout.write("\n");
}
rl.close();

if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("That doesn't look like an email address.");
if (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
  throw new Error("Password must be at least 12 characters and include letters and numbers.");
}

const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

// Create the user, or find the existing one with this email.
let userId;
const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (created.error) {
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const existing = data.users.find((u) => u.email?.toLowerCase() === email);
  if (!existing) throw created.error;
  const updated = await db.auth.admin.updateUserById(existing.id, { password });
  if (updated.error) throw updated.error;
  userId = existing.id;
  console.log("User already existed: password updated.");
} else {
  userId = created.data.user.id;
  console.log("User created.");
}

const { error } = await db.from("admin_users").upsert({ user_id: userId });
if (error) throw error;
console.log(`✓ ${email} is an admin. Sign in at /admin/login`);
