# Roadmap, Costs, Risks

_Status: Phase 0 draft, awaiting approval_

## 11. Development phases

| Phase | Scope | Key commits | Approval gate |
|---|---|---|---|
| **0** Product definition | This documentation | `docs: add phase 0 product definition` | **Now** |
| **1** Foundation | Next.js + TS + Tailwind + shadcn, tokens, fonts, header/footer/mobile nav, env validation, CI, git repo | `feat: initialize Next.js application`, `feat: add design system`, `feat: add site layout and navigation`, `ci: add GitHub Actions` | Review the visual foundation in the browser |
| **2** Marketing pages | Home, Solutions, How We Work, About, Contact (UI and validation; submit is stubbed), Privacy | one commit per page | Review copy and layout |
| **3** Portfolio | Project types, card, detail template, CompanyBrainAI, case-study template (unlisted) | `feat: add portfolio system` | Needs CompanyBrainAI material |
| **4** AI demo | Provider abstraction, analyzer, route, UI, cached examples, guardrails | `feat: add AI business problem demo` | Needs a free Gemini API key (no billing attached) |
| **5** Supabase | Migrations + RLS, lead storage, Resend notification, admin auth, leads dashboard | `feat: add lead storage`, `feat: add admin dashboard` | **Architecture gate** (security model) |
| **6** Hardening | SEO (JSON-LD, sitemap, OG), CSP/security headers, a11y audit, Lighthouse, error/empty states | | |
| **7** Testing | Playwright flows, mobile device testing, API-failure simulation | | |
| **8** Deploy | Production deploy, domain, docs: deployment, local-development, security, rollback | | **Go-live gate** |

Development and review happen locally (phones via the local network). The single deployment happens in Phase 8; the host (Netlify Free vs Cloudflare Workers Free) is chosen then.

## 14. Cost considerations

**Decision (2026-10-02): free-only.** No paid services. The only unavoidable cost is a domain name, and even that can wait until launch.

| Item | Choice | Cost | Notes |
|---|---|---|---|
| Hosting | **Netlify Free** | ₹0 | Commercial use allowed. Zero-config Next.js support. Fallback: Cloudflare Workers Free (OpenNext). Vercel Hobby was rejected because its terms prohibit commercial use |
| Database/Auth | Supabase Free | ₹0 | 500MB DB. Free projects pause after 7 days of inactivity; mitigated below |
| AI | Google Gemini API free tier | ₹0 | No billing account attached, so no charges are possible. Groq free tier as fallback |
| Email notifications | Resend Free | ₹0 | 3,000/mo, 100/day |
| Domain | `.com` | ~₹1,000/yr (optional until launch) | Until then: free `*.netlify.app` subdomain |
| Business email | Zoho Mail Forever Free (needs the domain) or Cloudflare Email Routing (free forwarding) | ₹0 | |
| DNS/CDN | Cloudflare Free | ₹0 | |
| CI | GitHub Actions | ₹0 | |
| Monitoring/analytics | none at launch | ₹0 | Sentry/PostHog free tiers later |

**Running cost: ₹0/month** (plus ~₹1,000/year for a domain once you want one).

Free-tier limits to watch: Netlify's monthly usage credits (builds and bandwidth), Gemini's daily request quota, and Resend's 100 emails/day. All are far above what a new company site needs.

## 15. Risks & assumptions

### Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Supabase free project pauses, so the contact form fails | **Lost leads** | (a) The lead email is sent *independently* of the DB insert, so a DB failure still emails the founder. (b) A weekly GitHub Actions keep-alive ping. (c) The form error state shows a direct email/WhatsApp fallback |
| AI demo abuse / quota exhaustion | Demo unavailable (no bills: free tier, no billing) | Layered caps + provider budget limit (see ai-architecture.md) |
| AI gives a poor or odd suggestion on a public site | Credibility | Schema-constrained output, tested prompt, disclaimer, cached curated examples as the default path |
| Spam on contact form | Noise | Honeypot + rate limit; add Cloudflare Turnstile (free) only if spam appears |
| Portfolio looks thin (one project) | Credibility | Present depth over breadth: a detailed CompanyBrainAI write-up with architecture beats five shallow cards. Mark future projects "In development" only if work has actually started |
| Overstating capability | Trust, legal | No fake logos, testimonials, or metrics. "Portfolio Project" labels everywhere |
| Data protection (India DPDP Act 2023, UAE PDPL) | Compliance | Privacy policy, collect only what's needed, consent line on form, hashed IPs, retention limits |
| Solo maintenance burden | Site goes stale | Content in typed files, few dependencies, CI, documented runbooks |

### Assumptions (correct me if wrong)
1. English only at launch. INR is the primary currency, with a USD/AED note in budget options.
2. **CompanyBrainAI exists at least as a working prototype** with screenshots I can use. If it is still a concept, the page will say so ("In development") and use architecture diagrams instead of screenshots.
3. There is no logo yet. I'll create a clean typographic wordmark as a placeholder.
4. The founder is the single admin user.
5. The domain is not yet decided (I'll use `NEXT_PUBLIC_SITE_URL` everywhere).
6. Company location is shown as a city in India. The UAE presence is phrased as "serving clients in India and the UAE" only once that is true.
7. Free-only: the Gemini free tier replaces OpenAI (no free API tier), and Netlify replaces Vercel.

### Information needed from you (not blocking Phase 1)
- Domain name and preferred contact email; WhatsApp number for click-to-chat
- CompanyBrainAI: current state, screenshots, actual stack, and features that really work
- Founder name, short bio, photo (optional), LinkedIn
- City/location to display; whether the company is registered (for footer/legal)
