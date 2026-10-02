# Technical Architecture

_Status: Phase 0 draft, awaiting approval_

## 7. Overview

One Next.js application. No separate backend, no microservices.

```
Browser
  │  (static/SSR HTML, minimal client JS)
  ▼
Next.js app (App Router, TypeScript)  ── hosted on Netlify Free (portable to Cloudflare/AWS/any Node host)
  ├─ Marketing pages      → statically generated (SSG), content from typed files in /src/content
  ├─ Server Action        → submitLead()        → Zod validate → rate limit → Supabase insert → email notify
  ├─ Route Handler        → POST /api/ai-demo   → Zod validate → rate limit → AI service → Supabase log
  ├─ /admin (dynamic)     → Supabase Auth session check (proxy/middleware + server-side) → RLS-protected reads
  └─ sitemap.ts / robots.ts / opengraph-image.tsx
          │                         │                     │
          ▼                         ▼                     ▼
     Supabase (Postgres + Auth)   AI provider (Gemini free tier)   Resend (lead email)
```

### Stack (current stable versions are confirmed at Phase 1 setup)
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript (strict) | Server Components by default; client components only where interactive |
| Styling | Tailwind CSS + shadcn/ui | shadcn components are copied into the repo, so there is no runtime dependency lock-in |
| Validation | Zod | One schema per form, shared by client and server; the server re-validates every time |
| Forms | React Hook Form + Zod resolver (contact form only) | Small and accessible |
| DB / Auth | Supabase (`@supabase/ssr`) | Free tier |
| AI | Google Gemini API (free tier) via our own `AIProvider` interface | Provider can be swapped (OpenAI, Groq, Anthropic…) by adding one file and changing one env variable |
| Email | Resend (free tier: 3,000 emails/month) | Lead notifications only |
| Icons | lucide-react | Tree-shaken |
| Fonts | `next/font` self-hosted | No requests to Google at runtime |
| Animation | CSS transitions; no animation library unless one is justified | Keeps JS small |
| Testing | Vitest (logic, schemas) + Playwright (key flows: nav, contact, demo, admin login) | Free |
| CI | GitHub Actions: typecheck, lint, test, build | Free for this scale |

### Key architectural rules
1. **Business logic lives in `src/services`, never in components.** Components call services through server actions or route handlers.
2. **Secrets are server-only.** Modules that touch secrets import `server-only`, so a build fails if client code imports them.
3. **Content is data.** Portfolio projects, solutions, and process steps are typed objects in `src/content`. Moving them to a Supabase table later only means changing the loader, not the UI.
4. **Portable.** No host-specific APIs (no Edge Config, Vercel KV, etc.). The app runs on any Node host (`next build && next start`, or Docker / Amplify / OpenNext).

## 12. Initial folder structure

```
weblabs/
├─ docs/                        Project documentation
├─ public/                      Static assets (logo, favicons, portfolio screenshots)
├─ supabase/
│  ├─ migrations/               SQL migrations (schema + RLS), source of truth
│  └─ seed.sql                  Local dev seed data
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/           Public site, shared header/footer layout
│  │  │  ├─ page.tsx            Home
│  │  │  ├─ solutions/
│  │  │  ├─ portfolio/[slug]/
│  │  │  ├─ case-studies/[slug]/ (template; unlisted)
│  │  │  ├─ how-we-work/
│  │  │  ├─ about/
│  │  │  ├─ contact/
│  │  │  ├─ ai-demo/
│  │  │  └─ privacy/
│  │  ├─ admin/                 login/, leads/, leads/[id]/, demo-runs/
│  │  ├─ api/ai-demo/route.ts
│  │  ├─ layout.tsx · not-found.tsx · error.tsx
│  │  ├─ sitemap.ts · robots.ts · opengraph-image.tsx
│  ├─ components/
│  │  ├─ ui/                    shadcn primitives
│  │  ├─ layout/                Header, MobileNav, Footer, Container, Section
│  │  ├─ sections/              Hero, ProblemGrid, SolutionCards, ProcessSteps, CtaBand…
│  │  ├─ portfolio/             ProjectCard, ProjectHeader, ArchitectureDiagram, TechStackList…
│  │  ├─ demo/                  DemoForm, DemoResult, WorkflowChain
│  │  ├─ forms/                 ContactForm, FormField
│  │  └─ admin/                 LeadsTable, StatusSelect
│  ├─ content/                  solutions.ts, process.ts, problems.ts, projects/companybrain-ai.ts
│  ├─ services/
│  │  ├─ ai/                    provider.ts (interface), gemini-provider.ts, business-analyzer.ts, prompts/
│  │  ├─ leads/                 create-lead.ts, list-leads.ts, update-lead.ts
│  │  ├─ notifications/         lead-email.ts
│  │  └─ rate-limit.ts
│  ├─ lib/
│  │  ├─ supabase/              server.ts, browser.ts, admin.ts (secret key, server-only)
│  │  ├─ validation/            lead.schema.ts, demo.schema.ts
│  │  ├─ seo.ts                 metadata + JSON-LD builders
│  │  ├─ env.ts                 Zod-validated env (fails fast at boot)
│  │  └─ utils.ts
│  ├─ config/                   site.ts (name, URL, contact, socials), nav.ts
│  ├─ types/                    project.ts, case-study.ts, lead.ts, database.ts (generated)
│  ├─ styles/globals.css        Tailwind + design tokens
│  └─ proxy.ts                  Admin route guard (named `middleware.ts` on older Next.js)
├─ tests/                       e2e (Playwright) + unit (Vitest)
├─ .env.example
└─ .github/workflows/ci.yml
```

## 13. Environment variables

| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, sitemap, OG |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Anon/publishable key (safe because RLS is enforced) |
| `SUPABASE_SECRET_KEY` | **server only** | Server-side inserts (leads, demo logs). Never sent to the browser |
| `AI_PROVIDER` | server | `gemini` (default); enables swapping providers |
| `GEMINI_API_KEY` | **server only** | AI demo (free key from Google AI Studio) |
| `AI_MODEL` | server | A small, cheap model, changeable without a code change |
| `AI_DEMO_MAX_PER_IP_PER_HOUR` | server | e.g. `5` |
| `AI_DEMO_MAX_PER_DAY` | server | Global cost ceiling, e.g. `200` |
| `IP_HASH_SALT` | **server only** | IPs are stored only as salted hashes (privacy) |
| `RESEND_API_KEY` | **server only** | Lead notification email |
| `LEAD_NOTIFICATION_EMAIL` | server | Where new-lead alerts go |
| `EMAIL_FROM` | server | e.g. `Mithila Web Labs <hello@yourdomain>` |
| _Later:_ `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY` | | Added only when needed |

`src/lib/env.ts` validates these at startup, so a missing key fails loudly at boot instead of failing silently in production.
