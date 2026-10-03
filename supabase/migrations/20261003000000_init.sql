-- Mithila Web Labs — initial schema (docs/database-design.md)
-- Three tables, RLS on all of them. Inserts happen only from server code using the secret key.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.lead_status as enum ('new', 'contacted', 'discovery', 'proposal', 'won', 'lost');

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- True when the signed-in user is an admin. SECURITY DEFINER so policies can call it
-- without granting direct read access to admin_users; search_path pinned for safety.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- AI demo runs (also the source of truth for demo usage limits)
-- ---------------------------------------------------------------------------
create table public.ai_demo_runs (
  id uuid primary key default gen_random_uuid(),
  input text not null check (char_length(input) between 1 and 1000),
  output jsonb,
  status text not null check (status in ('success', 'error', 'rate_limited', 'rejected')),
  error_kind text,
  provider text,
  model text,
  prompt_version text,
  input_tokens integer,
  output_tokens integer,
  latency_ms integer,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index ai_demo_runs_ip_hash_created_at_idx on public.ai_demo_runs (ip_hash, created_at desc);
create index ai_demo_runs_created_at_idx on public.ai_demo_runs (created_at desc);

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  company text check (char_length(company) <= 150),
  phone text check (char_length(phone) <= 30),
  company_size text,
  industry text,
  problem_description text not null check (char_length(problem_description) between 1 and 3000),
  current_process text check (char_length(current_process) <= 2000),
  timeline text,
  budget text,
  additional_info text check (char_length(additional_info) <= 2000),
  source text not null default 'contact_form' check (source in ('contact_form', 'ai_demo')),
  demo_run_id uuid references public.ai_demo_runs (id) on delete set null,
  status public.lead_status not null default 'new',
  notes text check (char_length(notes) <= 5000),
  ip_hash text,
  user_agent text check (char_length(user_agent) <= 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_created_at_idx on public.leads (status, created_at desc);
create index leads_ip_hash_created_at_idx on public.leads (ip_hash, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- anon: nothing. authenticated non-admin: nothing. admin: read leads/runs, update leads.
-- The server's secret key bypasses RLS for validated inserts.
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.ai_demo_runs enable row level security;
alter table public.leads enable row level security;

create policy "Admins can read admin list"
  on public.admin_users for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can read demo runs"
  on public.ai_demo_runs for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can read leads"
  on public.leads for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can update leads"
  on public.leads for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Belt and braces: the public roles get no table privileges beyond what policies allow.
revoke all on public.admin_users, public.ai_demo_runs, public.leads from anon;
revoke insert, delete, truncate on public.admin_users, public.ai_demo_runs, public.leads from authenticated;
revoke update on public.admin_users, public.ai_demo_runs from authenticated;
