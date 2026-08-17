# DIRECTION.md — context for continuing this build in Claude Code

Read this before touching code. It's the compressed output of a planning
conversation — treat decisions below as settled, and open items as genuinely
open (don't silently pick for the user).

## The one-line goal

Someone spends 60–90 seconds on this site and thinks "I understand why this
person does what he does, and I want to know more about him" — not "I just
read a résumé."

## Tone

Editorial. Playful. Curious. Warm. Slightly weird. Intentional. Made by a
person, not a personal-brand agency.

**Avoid:** generic portfolio cards, SaaS/startup landing-page aesthetics,
gradients-for-gradients, glassmorphism, skill bars, "Founder | Entrepreneur |
Gamer" language, walls of text, stock imagery, excessive animation.

## Reference site — arjun-r.com

Borrowed: interaction as personality (tap-to-like, tap-to-copy — already
implemented for the email link), fragmented conversational headline copy,
authentic artifacts over polished stock content, a low-key human closing CTA.

Explicitly NOT borrowed: its structure. That site is a case-study/hire-me
grid. This site is narrative-driven, not project-driven.

## Subtle Asian influence — how, not what

Not motifs (no lanterns, no cherry blossoms). Comes from spatial restraint —
generous negative space, precise typographic rhythm — and possibly one
small personal mark (stamp/seal-style signature at a section transition).
Nothing ornamental "for the sake of it."

## The narrative arc (the spine of the whole site, not just section 02)

Kid who loved games → wasn't taken seriously → found people who did → found
a team → competed → ~$80,000 in esports scholarships → realized what gaming
actually gave him → built EKUZO to give that to someone else.

**Connective throughline for the whole site, including "Life Outside Work":**
getting good at things he was initially bad at, because someone finally took
the interest seriously. Gaming was that. Backflips/climbing/cello are that
now. EKUZO exists to give other kids that same shot. Don't let section 04
read as a disconnected hobby list — tie it back to this line explicitly.

## Information architecture (5 sections, one scroll, already scaffolded)

01 Introduction — minimal copy, strong visual, the hook
02 My Story — the narrative spine, broken into short beats not paragraphs
03 What I'm Building — establishes EKUZO and why it matters, then links out
   to ekuzo.gg. Not a product pitch.
04 Life Outside Work — most playful section, photo/video-driven, annotation
   -style captions
05 Elsewhere — quiet close, contact links, tap-to-copy email

Fixed chapter nav (01→05) tracks scroll position — already implemented.

## Known content/asset details

- The $5,000 "EKUSO" check photo is a pitch-competition prize (Alumni
  Track), NOT the scholarship — it belongs in section 03, not 02. Don't
  conflate the two dollar figures.
- The close-up League photo (orange jerseys, mid-match) is the strongest
  candidate for section 02's competition beat.
- The "Houston vs Seattle" youth esports poster is existing EKUZO
  marketing collateral — useful in section 03, and its torn-paper/scrapbook
  treatment is a possible visual reference for section 04's photo grid.

## Locked decisions

- Stack: Vite + TypeScript, vanilla (no React/framework), GSAP/ScrollTrigger
  for scroll reveals, plain CSS with custom properties. No backend, no CMS,
  no auth.
- Neutrals: off-white + near-black (exact hex values in tokens.css are
  provisional, not final).
- One-page scroll, not multi-page.
- Chapter numbering (01–05) is justified per design-skill guidance because
  it's a real sequence (the narrative arc), not decoration.
- **Accent color: seal vermilion `#C1432E`.** Compared against oxblood,
  ink indigo, and deep jade on the real ground. Won on separation from the
  ink (3.58:1 vs. 2.49 next-best) — the ratio that matters here, since the
  accent only ever appears at small sizes. Ink indigo had the best
  background contrast and was ruled out anyway: at 2.02:1 against the ink it
  stops reading as colour in the chapter nav. Vermilion also makes the
  Asian influence a material rather than a motif — vermilion *is* seal ink,
  so the stamp mark has a reason to exist.
  **Caveat:** the EKUZO-confusion check was never actually run — ekuzo.gg
  was unreachable from the build session, so their orange was never sampled.
  Locked on the user's call with that test outstanding. If the two do read
  as confusable in practice, oxblood `#8C2F2A` is the fallback: same
  seal-ink logic, clearly further from orange.

## OPEN — do not decide these unilaterally

- **Typography.** Currently system fonts as a placeholder. No display/body
  pairing has been chosen yet.
- **All copy.** Every `[TODO]` in index.html is a placeholder, not a draft.
  The story-beat language especially needs real writing, not filler.

## Assets still needed from the user

- Backflip video
- Bouldering/climbing photos
- Piano/cello photo or clip
- Honda S2000 AP2 photos
- More candid/informal personal photos (everything currently on hand is
  event/press photography — great for section 03, but section 04 needs
  unposed material)
- Additional League/UTD esports photos beyond what's already provided
- EKUZO logo + program/coaching photos beyond the poster
- LinkedIn, Instagram, and email for section 05
