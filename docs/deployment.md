# Deployment

_Phase 1: preview deployments only. Production go-live, domain, and rollback steps are completed in Phase 8._

## Host: Netlify Free
Chosen because it is free, allows commercial use, and deploys Next.js with no configuration. See roadmap.md for the cost decision.

### One-time setup (about 10 minutes, done by the founder)
1. Push this repository to GitHub (a private repo is fine).
2. Sign in to [netlify.com](https://www.netlify.com) with GitHub, then **Add new project → Import an existing project → GitHub** and pick the repo.
3. Netlify detects Next.js automatically. Leave the build command (`npm run build`) and publish directory as detected.
4. **Site configuration → Environment variables:** add `NEXT_PUBLIC_SITE_URL` = the site's Netlify URL (e.g. `https://mithila-web-labs.netlify.app`).
5. Deploy. Each push to `main` deploys production, and each pull request gets its own preview URL.

### Rollback
Netlify → **Deploys** → choose a previous deploy → **Publish deploy**. This takes effect instantly with no rebuild.

### Fallback host
If Netlify's free limits ever become a problem: Cloudflare Workers Free via the OpenNext adapter. The app uses no Netlify-specific APIs.
