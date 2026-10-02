# Design Direction

_Status: implemented (premium pass, 2026-10-02)_

## Premium pass (2026-10-02)
- **Ink bands:** a warm near-black (`--ink` #0f0f0e) frames the site: header, hero and page intros, the closing CTA, and the footer. Light content sections sit in between.
- **Serif accent:** Instrument Serif italic (`accent-serif`) is used for one or two words per heading only.
- **Elevated cards** (`card-elevated`, `card-hover`): hairline ring, soft shadow, 1rem radius, 2px hover lift.
- **Texture:** a faint 64px grid (`bg-grid-ink`) and a single blurred vermilion glow per ink band. No other gradients.
- **Pill buttons** for large CTAs. `outline-ink` is the secondary button on dark backgrounds.
- **Small vermilion text on ink** uses `--brand-on-ink` (#f2895c) to keep 4.5:1 contrast.
- The navy `--deep` token was removed.

## 10. Principles
- **Editorial, not "AI startup".** Lots of whitespace, strong typography, real content as the visual.
- **Show the work.** Workflow diagrams, product screenshots, and architecture drawings instead of stock photos and abstract blobs.
- **One accent colour, used rarely.** It appears on CTAs, key highlights, and the workflow chain.
- **Motion is functional.** Use fades and slides under 200ms, and respect `prefers-reduced-motion`.

## Identity idea: a subtle Mithila thread
Mithila (Madhubani) art is known for fine line work, borders, and natural vermilion and indigo pigments. We borrow **the discipline of line, not folk-art decoration**:
- Thin 1px rules and borders as a structural motif (section dividers, card outlines, diagram lines)
- **Vermilion** as the single accent, on a warm-neutral base. This is distinct from the "corporate blue" and "purple AI gradient" defaults.
- Optional: a minimal geometric border pattern in the logo mark only

This gives the brand a distinctive, honest origin story without looking regional or ornamental.

## Tokens (initial; checked for contrast at Phase 1)
| Token | Value (approx.) | Use |
|---|---|---|
| `--background` | warm off-white `#FAFAF7` | page |
| `--foreground` | ink `#141413` | body text |
| `--muted` | `#F1F0EB` | alternate sections |
| `--muted-foreground` | `#5C5B57` | secondary text (≥ 4.5:1) |
| `--border` | `#E4E2DA` | 1px rules |
| `--primary` | ink `#141413` | primary buttons |
| `--accent` | vermilion `#C2410C`-ish | highlights, links, focus ring; text use only at AA-passing contrast |
| `--deep` | indigo/ink-blue `#1E2A44` | dark CTA bands, diagrams |

Radius: small (6–8px). Shadows: almost none; borders do the work.

## Typography
- **Geist Sans** for UI and body, and **Geist Mono** for technical labels (stack tags, workflow step types, code-like accents). Both are free and self-hosted via `next/font`.
- Fluid type scale; display headlines 48–72px desktop / 36–40px mobile, tight tracking.
- Max line length ~68ch for body text.

## Components (shadcn base, restyled)
Button (primary / secondary / ghost / link), Badge (e.g. "Portfolio Project"), Card, Input / Textarea / Select, Accordion (FAQ), Sheet (mobile nav), Table (admin), Toast (form feedback).

## Layout
- 12-column grid, max width ~1200px, 16px mobile gutter.
- Section rhythm: 96–128px vertical spacing desktop, 64px mobile.
- Mobile-first. The nav collapses to a Sheet below `md`, and the CTA button stays visible.

## Accessibility baseline
WCAG 2.2 AA: visible focus rings (accent colour), skip link, semantic landmarks, every input labelled with errors linked via `aria-describedby`, 44px touch targets, no information conveyed by colour alone (workflow step types also have icons and labels).

## Visual assets needed
Logo (wordmark first, a simple mark optional), favicon, OG image template (generated in code), CompanyBrainAI screenshots, founder photo (optional).
