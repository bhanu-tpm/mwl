# Deployment

_Decision (2026-10-02): develop and review everything locally; deploy once, in Phase 8. GitHub (`bhanu-tpm/mwl`) is used for backup and CI only._

## Testing on a phone before deployment
Run `npm run dev`, then on a phone connected to the same Wi-Fi open `http://<your-Mac-IP>:3000` (the IP is shown in the dev server output as **Network**, or run `ipconfig getifaddr en0`). If the page won't load, allow incoming connections for `node` in macOS Settings → Network → Firewall. Local-network addresses (`192.168.*`, `10.*`) are allowed via `allowedDevOrigins` in `next.config.ts`; add others there if your network uses a different range.

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


## Production database and email (do at Phase 8, about 20 minutes)

### Supabase (free)
1. Create a project at [supabase.com](https://supabase.com) (region: Mumbai, `ap-south-1`).
2. **Authentication → Sign In / Providers:** turn **off** "Allow new users to sign up". Keep the Email provider **on**.
3. Apply the schema from your Mac:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
4. **Project Settings → API Keys:** copy the URL, publishable key, and secret key into the host's environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`).
5. Create your admin: put the production URL and secret key in a temporary shell and run `npm run admin:create`.
6. GitHub → repo **Settings → Secrets and variables → Actions:** add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` so the keep-alive workflow can stop the free project from pausing.

### Resend (free: 3,000 emails/month)
1. Sign up at [resend.com](https://resend.com) with the email that should receive leads; create an API key.
2. Set `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` (that same email).
3. Later, after buying the domain: verify it in Resend and set `EMAIL_FROM` to e.g. `Mithila Web Labs <hello@yourdomain>`.
