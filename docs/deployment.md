# Deployment

_Decision (2026-10-02): develop and review everything locally; deploy once, in Phase 8. GitHub (`bhanu-tpm/mwl`) is used for backup and CI only._

## Testing on a phone before deployment
Run `npm run dev -- -H 0.0.0.0` and open the printed **Network** URL on a phone connected to the same Wi-Fi.

## Host (final choice in Phase 8)
Both candidates are free and allow commercial use:
- **Netlify Free:** zero-config, but the credit-based plan allows only about 20 production deploys a month, and the site pauses if credits run out.
- **Cloudflare Workers Free:** no deploy limits, unlimited bandwidth, 100k requests/day; needs the OpenNext adapter.

The Netlify steps below are kept for reference.

### One-time setup (about 10 minutes, done by the founder)
1. Push this repository to GitHub (a private repo is fine).
2. Sign in to [netlify.com](https://www.netlify.com) with GitHub, then **Add new project → Import an existing project → GitHub** and pick the repo.
3. Netlify detects Next.js automatically. Leave the build command (`npm run build`) and publish directory as detected.
4. **Site configuration → Environment variables:** add `NEXT_PUBLIC_SITE_URL` = the site's Netlify URL (e.g. `https://mithila-web-labs.netlify.app`).
5. Deploy. Each push to `main` deploys production, and each pull request gets its own preview URL.

### Rollback
Netlify → **Deploys** → choose a previous deploy → **Publish deploy**. This takes effect instantly with no rebuild.

