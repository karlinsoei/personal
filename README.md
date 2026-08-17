# karlin-site

Personal site — one scrolling narrative, five chapters. Static, no backend.

## Stack

- **Vite + TypeScript** — no framework overhead for a mostly-static site
- **GSAP / ScrollTrigger** — scroll-triggered reveals, one consistent effect
  (fade + rise) rather than scattered per-element animation
- **Plain CSS with custom properties** — see `src/styles/tokens.css`, the
  single place color and type get defined
- **Fraunces + IBM Plex Mono, self-hosted via Fontsource** — installed as npm
  dependencies and bundled by Vite, so there are no CDN requests at runtime
- No database, no auth, no CMS

The scroll reveals are progressive enhancement, not a dependency. The hidden
starting state is gated behind a `.js` class set inline in `<head>`, and a
3-second failsafe drops that class if the module never boots. Verified
against three cases: JS disabled, bundle blocked, and normal load — the
first two render all content, the third still animates on scroll. If you
touch `main.ts` or the `[data-reveal]` rules in `base.css`, re-check that.

## Structure

```
index.html               five <section> elements, one per chapter
src/main.ts               reveal animations, chapter-nav active state, tap-to-copy email
src/styles/tokens.css     design tokens — colors, type scale, spacing (PLACEHOLDERS, see below)
src/styles/base.css       reset, base typography, reduced-motion handling
src/styles/sections.css   per-section layout
public/assets/images/     drop photos here
public/assets/video/      drop video here (e.g. the backflip clip)
```

## Status: visual system locked, copy drafted, assets pending

Plumbing, accent colour, and typography are settled — see `tokens.css`,
which carries the reasoning for each. Copy is written throughout. Still open:

- **Section 05 handles** — email, LinkedIn, and Instagram are still `[TODO]`
  in `index.html`, left for the owner to fill in. The tap-to-copy handler
  no-ops while the `[TODO` guard is present, so the page is safe to ship as
  is.
- **Real assets** — `.media-slot` divs are hatched placeholders marking
  where photos/video go (see `data-placeholder` attribute on each for what's
  expected there). This is the main thing standing between the current build
  and a shippable site.
- **Copy accuracy** — the writing follows the arc in `DIRECTION.md` and
  invents no dates, teams, or placements, but the incidental details are
  guesses and want a pass from the owner.

## Adding photos

Camera originals are 10–20 MB each. None of that belongs in the browser or in
git history, so originals stay out of the repo:

1. Put full-resolution files in `source-images/` (gitignored).
2. `npm run images`

For each source that produces, in `public/assets/images/`:

```
<name>.jpg        1000px, mozjpeg q82 — the fallback
<name>.webp       1000px, q80        — what most browsers take
<name>@2x.webp    2000px, q72        — high-density screens
```

The filename becomes the asset name, lowercased and hyphenated, so
`0141.jpg` → rename it to `karlin-hero.jpg` first. Re-running only rebuilds
sources newer than their outputs; `npm run images -- --force` rebuilds all.

Markup uses `<picture>` with a WebP `source` and a JPEG `img` fallback. The
hatched `.media-slot` sits behind each image, so the layout still reads while
a file is missing.

## Running it

```
npm install
npm run dev       # local dev server
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

## Deploying

Static output in `/dist` after `npm run build` — drop it on Vercel or
Netlify directly, or connect the repo for auto-deploys on push. No
environment variables or server config needed.
