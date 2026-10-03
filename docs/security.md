# Security

_Status: Phase 6 (2026-10-03). Review again before go-live (Phase 8) and after adding any third-party service._

## Secrets
- All secrets are server-only environment variables (`.env.local` locally, the host's settings in production). `.env*` is git-ignored; only `.env.example` (no values) is committed.
- Server modules that use secrets import `server-only`, so a client import fails the build.
- The browser never talks to Supabase or Gemini directly; every call goes through our server.
- Zod and other server-only code are kept out of client bundles (zod-free `lead.options.ts`, `demo.constants.ts`, and `lib/env.ts`).

## HTTP headers (`next.config.ts`)
| Header | Value / purpose |
|---|---|
| Content-Security-Policy | `default-src 'self'`; scripts, data (`connect-src`), fonts, and images only from this origin; `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`; `upgrade-insecure-requests` when the site URL is https |
| Strict-Transport-Security | 2 years, subdomains, preload |
| X-Frame-Options | DENY (clickjacking, legacy browsers) |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera, microphone, geolocation, topics disabled |
| Cross-Origin-Opener-Policy | same-origin |

**CSP trade-off:** `script-src` includes `'unsafe-inline'` because Next.js emits inline scripts. The alternatives are nonces (forces every page to render on each request: slower and uses more of the free hosting allowance) or experimental SRI hashes. React escaping prevents injected markup; the CSP still blocks third-party scripts, exfiltration, framing, and plugin content. Verified: zero CSP violations on every page via Chrome's DevTools issues.

## Application controls
| Area | Control |
|---|---|
| Contact form | Server-side Zod validation, honeypot, per-visitor hourly limit (DB), length limits in the schema and in Postgres `check` constraints |
| AI demo | Input limits, prepared examples at zero cost, per-visitor hourly + site-wide daily caps (DB), prompt treats input as data, schema-validated output, provider safety blocks handled, no billing attached to the key |
| Visitor identity | Only a salted SHA-256 hash of the IP is stored; platform client-IP headers preferred so `x-forwarded-for` can't be spoofed |
| Admin | `proxy.ts` (optimistic redirect + session refresh) → `requireAdmin()` on every page and action (`getUser()` verified with the auth server + `is_admin()`) → RLS in Postgres |
| Auth | Public sign-up disabled, 12+ char passwords with letters and digits, generic login errors, Supabase's built-in sign-in rate limits |
| Database | RLS on every table; anon and non-admins have no access; admins read leads/runs and update leads only (no delete); inserts only via the server's secret key |
| Data retention | AI demo runs deleted after 90 days (`pg_cron`) |
| Errors | Friendly error boundaries (`error.tsx`, `global-error.tsx`) show a reference digest, never stack traces |

## Before go-live checklist
- [ ] Production secrets set in the host; `IP_HASH_SALT` is a long random value.
- [ ] Supabase: "Allow new users to sign up" off; email provider on; migrations applied with `supabase db push`.
- [ ] Gemini key has no billing attached; Resend key scoped to sending.
- [ ] `NEXT_PUBLIC_SITE_URL` is the https production URL (enables `upgrade-insecure-requests`).
- [ ] Re-run the CSP issue check and axe scan on the live URL.
