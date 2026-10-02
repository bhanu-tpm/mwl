# Requirements & MVP Scope

_Status: Phase 0 draft, awaiting approval_

## 4. Information architecture

```
/                       Home
/solutions              Solutions (4 categories; each: Problem → Approach → Example → Benefit)
/portfolio              Selected Projects (card grid)
/portfolio/[slug]       Project detail (CompanyBrainAI first)
/how-we-work            Engagement process (7 steps)
/about                  Company story + founder section
/contact                Enquiry form (+ WhatsApp / email alternatives)
/ai-demo                (anchor on Home + dedicated page; see decision below)
/privacy                Privacy policy (required: we collect personal data)
/case-studies/[slug]    Template exists, NOT linked in nav until a real client case study exists
/admin                  Protected: login, leads list, lead detail
```

**Primary nav:** Solutions · Portfolio · How We Work · About · **[Discuss Your Problem]** (button → /contact)
**Footer:** nav links, contact email, WhatsApp, location, privacy, © Mithila Web Labs

### Home page section order
1. Hero: headline, supporting text, two CTAs
2. Problems we fix: 7 recognisable pain points, each written in the business owner's words
3. What we build: 4 solution cards linking to /solutions#…
4. AI demo: interactive (invoice/WhatsApp example prefilled)
5. Featured work: CompanyBrainAI card labelled **"Portfolio / Founder Project"**
6. How we work: condensed 9-step strip, links to /how-we-work
7. Final CTA: "Have a business process that should be better?"

### IA decisions (proposed)
- **Case Studies:** the brief says not to present portfolio work as client work. Recommendation: name the portfolio "Selected Projects", build the case-study *template and data type* now (Challenge / Existing Process / Solution / Technology / Implementation / Outcome / Quote), but keep it out of navigation and the sitemap until the first real case study exists. An empty "Case Studies" page hurts credibility.
- **AI demo** lives on Home (where most traffic arrives) and also at `/ai-demo`, so it can be linked from LinkedIn and outreach messages.
- **Home "How we work"** shows the 9-step version from the brief, and **/how-we-work** shows the 7-step engagement model. The 9 steps map onto the 7, so the two never contradict each other.

## 5. MVP features

**Marketing site**
- [ ] All pages above, with real copy (no Lorem Ipsum), mobile-first, accessible
- [ ] Reusable section components (Hero, ProblemGrid, SolutionCard, ProcessSteps, CTA band, ProjectCard)
- [ ] Portfolio system: typed content files → card grid and detail template
- [ ] CompanyBrainAI project page (problem, vision, features, architecture diagram, AI capabilities, stack, screenshots, flow, roadmap)

**Lead capture**
- [ ] Contact form with server-side validation (Zod), honeypot, rate limiting
- [ ] Required fields kept short: **Name, Work email, Business problem**. Everything else is optional, which lowers the effort of the first message.
- [ ] Leads stored in Supabase
- [ ] Email notification to the founder for every new lead
- [ ] WhatsApp click-to-chat link (free and very effective with Indian SMEs)
- [ ] Clear success state ("We'll reply within 1 business day") and error state with a fallback email

**AI demo**
- [ ] Text input with 3–4 one-click example prompts
- [ ] Server-side call returns structured output: Current problem → Suggested solution → Workflow steps → Benefits → Considerations
- [ ] Workflow rendered as a visual step chain, not as a block of text
- [ ] Clear disclaimer: "AI-generated suggestion, not professional consulting advice"
- [ ] "Discuss this with us" button that pre-fills the contact form with the problem
- [ ] Abuse protection: input length cap, per-IP limit, global daily cap, output token cap
- [ ] Example prompts return precomputed responses at zero API cost

**Admin (minimal)**
- [ ] Supabase Auth login (email + password; public sign-up disabled)
- [ ] Leads table: list, filter by status, view detail, change status, add notes
- [ ] Read-only view of recent AI demo runs (to learn which problems visitors care about)

**Foundation**
- [ ] SEO: metadata, OG images, sitemap.xml, robots.txt, canonical URLs, JSON-LD (Organization, WebSite, Service, BreadcrumbList)
- [ ] Security headers (CSP, HSTS, etc.) and an `.env.example`
- [ ] Docs in `/docs`

## 6. Not in the MVP (deferred deliberately)

| Item | Why deferred | Trigger to build it |
|---|---|---|
| CMS / admin editing of portfolio & content | Content changes rarely; typed files in Git are simpler and versioned | Editing more than weekly, or a non-developer editing content |
| Blog / insights | Needs ongoing writing effort | Founder commits to 2 posts/month (good for SEO later) |
| Arabic / RTL, multi-language | No UAE traffic yet | Active UAE pipeline. We will use logical CSS properties now so RTL is cheap later |
| Dark mode | Not a conversion driver | Post-launch polish |
| Analytics (PostHog) | Keep the first launch free of third-party scripts | Once there is meaningful traffic |
| Sentry | Vercel/host logs are enough at low volume | First production incident or more than 1 paid project |
| Full CRM, pipeline boards, email sequences | Over-engineering for under 20 leads | Lead volume above ~20/month |
| Booking calendar (Cal.com) | A simple link is enough | Can be added as a link at any time (free) |
| Chatbot / RAG on site content | Novelty, not conversion | Later, as a CompanyBrainAI demo |
| Client case studies | No clients yet | First completed engagement |
| Pricing page | Pricing is engagement-specific | Productized services launch |
