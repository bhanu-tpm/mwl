# Database Design

_Status: Phase 0 draft, awaiting approval · Supabase Postgres_

## 8. Requirements

- Store enquiries reliably. A lost lead is the most expensive failure on this site.
- Log AI demo runs, both for rate limiting and to learn which problems visitors bring.
- Let only the admin read data. Anonymous visitors can never read anything.
- Keep the design simple: **3 tables**. No CRM tables.

## Tables

### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| name | text not null | |
| company | text | |
| email | text not null | |
| phone | text | optional |
| company_size | text | enum-like values: `1-10`, `11-50`, `51-200`, `201-1000`, `1000+` |
| industry | text | |
| problem_description | text not null | **the key field** |
| current_process | text | "How is it handled today?" |
| timeline | text | `asap`, `1-3m`, `3-6m`, `exploring` |
| budget | text | range bucket (see open question on currency) |
| additional_info | text | |
| source | text not null default `'contact_form'` | `contact_form` / `ai_demo` |
| demo_run_id | uuid FK → ai_demo_runs | set when the lead came via "Discuss this with us" |
| status | `lead_status` enum default `'new'` | `new, contacted, discovery, proposal, won, lost` |
| notes | text | admin's private notes |
| ip_hash | text | for rate limiting; never the raw IP |
| user_agent | text | spam forensics |
| created_at / updated_at | timestamptz | `updated_at` maintained by trigger |

Indexes: `(status, created_at desc)`, `(ip_hash, created_at)`.

### `ai_demo_runs`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| input | text not null | max 1,000 chars, enforced in a DB `check` and in Zod |
| output | jsonb | structured result; null on failure |
| status | text | `success`, `error`, `rate_limited`, `rejected` |
| model / provider | text | |
| input_tokens / output_tokens / latency_ms | int | for cost tracking |
| ip_hash | text | |
| created_at | timestamptz | |

Index: `(ip_hash, created_at)` and `(created_at)` for the per-IP and global daily caps. **This table also serves as the rate limiter**: we count recent rows instead of adding Redis.

### `admin_users`
| Column | Type |
|---|---|
| user_id | uuid PK → `auth.users(id)` |
| created_at | timestamptz |

Helper: `is_admin()` is a `security definer` SQL function that returns true if `auth.uid()` is in `admin_users`.

## Row Level Security

RLS is **enabled on every table**.

| Table | anon | authenticated non-admin | admin |
|---|---|---|---|
| leads | none | none | select, update |
| ai_demo_runs | none | none | select |
| admin_users | none | none | select |

**Inserts** happen only from server code using the secret key, after validation and rate limiting. Even if the publishable key is copied out of the browser, it cannot read or write anything.

Public sign-ups are **disabled** in Supabase Auth. The admin user is created manually in the dashboard and added to `admin_users` via SQL.

## Not stored in the database (MVP)
Portfolio projects, case studies, solutions, and site copy live as typed TypeScript files in `src/content`. If an admin content editor is needed later, these move to `projects` / `case_studies` tables that use the same TypeScript types.

## Retention
- Leads are kept until deleted by the admin (documented in the privacy policy).
- `ai_demo_runs` are auto-deleted after 90 days (scheduled SQL via `pg_cron`, available on the free tier).
