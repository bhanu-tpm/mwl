# Local Development

## Prerequisites
- Node.js ≥ 20.9 (developed on Node 24)
- npm (comes with Node)
- Git

## Setup
```bash
git clone <repo-url> mithila-web-labs
cd mithila-web-labs
npm install
cp .env.example .env.local   # fill in values as phases add them
npm run dev                   # http://localhost:3000
```

## Local database (Supabase)
Needs Docker running. The first start downloads images once (a few GB).
```bash
npm run db:start        # local Postgres + Auth + API on ports 553xx (runs beside other Supabase projects)
npx supabase status     # shows API_URL, PUBLISHABLE_KEY, SECRET_KEY for .env.local
npm run admin:create    # create your admin login (public sign-up is disabled)
npm run db:reset        # wipe and re-apply supabase/migrations (deletes local data)
npm run db:stop
```
Then sign in at http://localhost:3000/admin/login.

Without the database variables the site still runs: the contact form logs enquiries to the
terminal in development, and the AI demo uses in-memory limits.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm run db:start` / `db:stop` / `db:reset` | Local Supabase stack |
| `npm run admin:create` | Create or promote an admin user |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, and build on every push and PR to `main`.

## Conventions
- **Next.js 16.** APIs differ from older versions. Version-matched docs are in `node_modules/next/dist/docs/` (see `AGENTS.md`).
- **Server Components by default.** Add `"use client"` only for interactivity (e.g. `mobile-nav.tsx`, `nav-links.tsx`).
- **UI primitives** come from shadcn/ui: `npx shadcn@latest add <component>`. They are copied into `src/components/ui/` and can be edited freely.
- **Design tokens** live in `src/styles/globals.css` (`:root`). Use Tailwind classes such as `bg-brand`, `text-muted-foreground`, `bg-deep`, and the type utilities `text-display`, `text-h2`, `text-h3`, `text-lead`, `eyebrow`.
- **Company facts and navigation** live in `src/config/`, so there are no hard-coded names or links in components.
- **Environment variables** are validated in `src/lib/env.ts`. Never put secrets in `NEXT_PUBLIC_*` variables.

## Adding a page
1. Create `src/app/(marketing)/<route>/page.tsx` (it inherits the header and footer).
2. Export `metadata` with a `title` and `description`.
3. If it belongs in navigation, add it to `src/config/nav.ts`.
