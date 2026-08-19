# Akash Surve — portfolio

Personal site. Rebuilt from scratch in 2026: the previous version was a
Create React App template (MUI v4, `react-reveal`, eight colour themes); this
one is a small hand-written Vite app with a single design system.

**Stack** — Vite 7 · React 19 · TypeScript · Tailwind CSS v4 · Motion

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint       # type-check only
npm run check      # build, then run the browser check suite
```

## Checks

`npm run check` builds the site and drives it in a real browser. Every
assertion in `scripts/checks/` exists because something actually broke:

| Suite | Covers |
|---|---|
| `responsive` | 14 widths from 320 to 2560px: sideways scroll, elements escaping the viewport, clipped text, console errors |
| `a11y` | axe-core WCAG 2.1 AA in **both** themes — contrast bugs only appear in one |
| `interactions` | Bottom bar, gallery, active-section tracking, skip link, tab order, prefilled mailto, reduced motion |
| `hash` | Every deep link lands correctly on first load **and** after reload |
| `theme` | Follows the system until the visitor chooses, then never overrides them |
| `perf` | Budgets: no third-party requests, FCP under 400ms, LCP under 800ms, request and transfer caps |

It runs against `dist`, not the dev server, so what is measured is what ships.
`npm run check:only` skips the build when a server is already up; pass
`-- --url http://localhost:5173` to point it somewhere else.

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts) — profile, case
studies, toolkit, timeline, freelance services, engagement process,
evidence links, contact and nav. Components read
from it and nothing else, so adding a chapter or a job means editing one file.

A case study is a `CaseStudy`: masthead (summary, metrics, stack, links), an
optional screenshot gallery, one `context` paragraph on why the work existed,
numbered `chapters` with bullets, and a flat `details` list for everything that
deserves a mention but not a chapter.

Images: `src/assets/` (imported, hashed and served by Vite).
The résumé is served verbatim from `public/Akash_Surve_Resume.pdf` — replacing
that file is enough, no code change.

## Design system

Colour, spacing and type tokens are CSS custom properties in
[`src/index.css`](src/index.css), exposed to Tailwind through `@theme`.
Light is the `:root` palette, dark overrides it under `.dark`. The theme is
applied by an inline script in `index.html` before first paint so there is no
flash, then owned by `src/lib/useTheme.ts` (stored in `localStorage`, falling
back to `prefers-color-scheme`).

Typefaces: Instrument Serif (display), Inter (body), JetBrains Mono (labels) —
self-hosted from `src/assets/fonts`, latin and latin-ext only. Inter and
JetBrains Mono are variable, so one file per subset covers the 400–500 range the
page uses. Vite content-hashes them; `scripts/seo.mjs` reads the hashed names
back out to emit `<link rel="preload">` for the two faces above the fold.

## Search and AI discoverability

`npm run build` runs three steps:

1. `vite build` — the client bundle.
2. `scripts/prerender.mjs` — renders the app with `react-dom/server` and inlines
   the result into `dist/index.html`. Without this the page ships as an empty
   `<div id="root">`: Google can execute JavaScript, but most AI crawlers
   (GPTBot, ClaudeBot, PerplexityBot) and every social-preview scraper cannot,
   so they would index nothing. The client still mounts with `createRoot` and
   re-renders, so the prerendered markup does not have to match — it only has to
   be readable. Entrance animations detect the server and skip their hidden
   initial state, so no text is prerendered at `opacity: 0`.
3. `scripts/seo.mjs` — generates, from `src/data/site.ts` and `content.ts`:
   canonical and Open Graph tags, JSON-LD (`ProfilePage`, `Person`,
   `ProfessionalService` with an offer catalogue, `SoftwareApplication` for
   ClipBuddy, and `FAQPage`), `sitemap.xml`, `robots.txt` with the AI crawlers
   named explicitly, and `llms.txt` for assistants that prefer plain text.

**The canonical URL lives in one place: `site.url` in
[`src/data/site.ts`](src/data/site.ts).** Change it there and rebuild.

`public/og.png` is a static 1200x630 card; regenerate it by hand if the copy
changes.

## Deploying

Netlify builds from this repository — [`netlify.toml`](netlify.toml) sets the
build command, the publish directory and the cache headers. Pushing to the
branch Netlify watches is the whole deploy.

The canonical URL lives in one place: `site.url` in
[`src/data/site.ts`](src/data/site.ts). It feeds the canonical tag, Open Graph,
`sitemap.xml`, the JSON-LD and `llms.txt`. Changing hosts or adding a custom
domain means changing that line and rebuilding — a canonical that does not match
where the page is served works against you rather than for you.

### Moving to a custom domain later

1. Add the domain in Netlify and point its DNS at Netlify.
2. Set `site.url` to the new origin.
3. Rebuild and push. Netlify keeps serving the `.netlify.app` host too, so add a
   redirect to the custom domain if you want a single canonical origin.

The site is one static page with no router, so any static host works
(Netlify, Vercel, Cloudflare Pages) with `npm run build` and `dist` as output.
