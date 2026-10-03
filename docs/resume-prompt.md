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

## Current state (as of 2026-10-03, after Phase 6)
Done: Phase 0 docs · Phase 1 foundation (Next.js 16, Tailwind v4, shadcn/ui, CI) · Phase 2 pages
(Home, Solutions, How We Work, About, Contact form UI + server validation, Privacy) · premium
"ink" design pass · neural-net "mwl" logo (src/components/layout/logo.tsx) · first-visit intro
loader showing our 4 capabilities (intro-loader.tsx, once per session) · hero "tools → products"
visual · Problem section = live SVG problems→outcomes flow + interactive picker that pre-fills
/contact?problems=… · "AI in practice" industry explorer with human-in-the-loop runs · Phase 4 AI demo (/ai-demo,
POST /api/ai-demo, Gemini provider, prepared examples, in-memory usage limits, contact pre-fill
via ?brief=) · Phase 5: local Supabase (Docker, ports 553xx, `npm run db:start`) with
RLS-verified schema, leads stored + Resend email (email needs RESEND_API_KEY), DB-backed demo
limits + run log, protected /admin (proxy.ts + DAL + RLS), `npm run admin:create`, keep-alive
workflow · Phase 6: sitemap/robots, branded OG images, JSON-LD, no-nonce CSP (0 violations),
error boundaries, axe 0 violations, Lighthouse 100/100/100 (a11y/best/SEO), perf 93–95. Portfolio
links point to /#work and /contact until Phase 3. Live Gemini was working locally (GEMINI_API_KEY in .env.local, default model
gemini-3.5-flash-lite; 2.5-flash-lite is retired). Never mention Tally anywhere in content.

Known gaps:
- Gemini key in .env.local was replaced with a non-API-key token (starts "AQ.", returns 401);
  it must be an AI Studio API key starting "AIza". Lead emails need a Resend key.
- /portfolio and /portfolio/[slug] return 404. Portfolio (Phase 3) is ON HOLD until
  I share CompanyBrainAI details.
- Contact email in src/config/site.ts is a placeholder; WhatsApp and founder details are empty.

## Next task: Phase 7 — Testing
Add an automated test suite that CI runs: Vitest for unit tests (lead/demo schemas, rate-limit
helpers, clientIp, Gemini provider with mocked fetch, problemsToEnquiry, JSON-LD builders) and
Playwright e2e against `next start` + the local Supabase (home interactions, AI demo examples,
contact form → lead stored, spam limit, admin auth incl. non-admin, CSP issue check, axe scan,
mobile viewport). Keep tests fast and deterministic (no real Gemini calls). Then Phase 8 deploy.

Start by summarising what you found in the repo and your Phase 7 plan in a few lines, then
build it. Ask me only if something is genuinely blocked.
