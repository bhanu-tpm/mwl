You are continuing work on the Mithila Web Labs company website in this repo
(/Users/aanu/Desktop/weblabs, GitHub: bhanu-tpm/mwl). Read before doing anything:
AGENTS.md (Next.js 16 has breaking changes; use node_modules/next/dist/docs), docs/roadmap.md,
docs/architecture.md, docs/ai-architecture.md, docs/database-design.md, docs/design-system.md,
and `git log --oneline -30`.

## Ground rules (from the founder)
- FREE ONLY: no paid services. Hosting chosen at Phase 8 (Netlify Free or Cloudflare Workers Free).
  AI = Google Gemini free tier (no billing attached), behind the AIProvider abstraction.
  DB/Auth = Supabase free. Email = Resend free.
- Develop and review locally; deploy once at the end (Phase 8). Push commits to GitHub as backup.
- Premium, intuitive, "live"-feeling UI. If my feedback is vague and your first attempt misses,
  offer 3–4 concrete options with previews instead of guessing again.
- Verify every UI change with screenshots on desktop AND mobile (Playwright via installed
  Chrome, channel "chrome", script in the session scratchpad), plus lint, typecheck, and build,
  before telling me it's done.
- Small, meaningful commits ending with the Co-Authored-By line. Don't make claims on the site
  that aren't true (no fake clients, metrics, or testimonials).
- Explain changes briefly in plain language; I test on my phone at http://<mac-ip>:3000.

## Current state (as of 2026-10-03, after Phase 4)
Done: Phase 0 docs · Phase 1 foundation (Next.js 16, Tailwind v4, shadcn/ui, CI) · Phase 2 pages
(Home, Solutions, How We Work, About, Contact form UI + server validation, Privacy) · premium
"ink" design pass · neural-net "mwl" logo (src/components/layout/logo.tsx) · first-visit intro
loader showing our 4 capabilities (intro-loader.tsx, once per session) · hero "tools → products"
visual · Problem section = live SVG problems→outcomes flow + interactive picker that pre-fills
/contact?problems=… · "AI in practice" industry explorer with human-in-the-loop runs · Phase 4 AI demo (/ai-demo,
POST /api/ai-demo, Gemini provider, prepared examples, in-memory usage limits, contact pre-fill
via ?brief=). Live AI needs GEMINI_API_KEY in .env.local; without it only examples work.

Known gaps:
- Contact form does NOT store leads yet (dev logs to terminal; production shows an email
  fallback). Storage + notifications come in Phase 5.
- /portfolio and /portfolio/[slug] return 404. Portfolio (Phase 3) is ON HOLD until
  I share CompanyBrainAI details.
- Contact email in src/config/site.ts is a placeholder; WhatsApp and founder details are empty.
- The intro's inline script must be allowed by the CSP in Phase 6 (hash).

## Next task: Phase 5 — Supabase (leads, demo logs, admin)
Follow docs/database-design.md: SQL migrations in supabase/migrations with RLS on every table
(leads, ai_demo_runs, admin_users + is_admin()); lead storage from the contact server action
(src/services/leads/create-lead.ts) with honeypot + DB-backed rate limit; Resend email to the
founder sent independently of the DB insert; move AI demo limits from src/services/rate-limit.ts
to counts on ai_demo_runs and log each run; Supabase Auth admin login (sign-ups disabled) and a
minimal /admin leads list/detail with status + notes. I must create the free Supabase project
and Resend account myself — give me exact steps and the env vars to set, and keep everything
working locally until I do.

Start by summarising what you found in the repo and your Phase 4 plan in a few lines, then
build it. Ask me only if something is genuinely blocked.
