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

## Status: visual system locked, content open

Plumbing, accent colour, and typography are all settled — see `tokens.css`,
which carries the reasoning for each. Still open:

- **All copy** — every `[TODO]` in `index.html` is a content placeholder,
  not a draft to publish. The story-beat language, EKUZO framing, and
  closing line all need actual writing.
- **Real assets** — `.media-slot` divs are hatched placeholders marking
  where photos/video go (see `data-placeholder` attribute on each for what's
  expected there).

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
