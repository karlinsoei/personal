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

Kid who played too much → told to stop → social anxiety and divorced parents,
with League and Call of Duty as refuge → found five guys in college who cared
about it too → competed → $80,000 in scholarships, for gaming → the thing he'd
been told to stop doing was finally treated as worth being good at → six years
spent working out why that mattered.

**No company is named anywhere on the site.** The organisation Karlin runs is
deliberately unnamed; the work is described as "the past six years" and by
what it consists of. This is a change from the earlier draft, which built
section 03 around EKUZO by name and linked out to ekuzo.gg. Both are gone.
If a name is ever reinstated, it is a content decision, not a layout one —
section 03's structure works either way.

**Connective throughline for the whole site, including section 04:**
getting good at things he was initially bad at, because someone finally took
the interest seriously. Gaming was that. Backflips/climbing/cello are that
now. Don't let section 04 read as a disconnected hobby list — tie it back
explicitly.

## Information architecture (5 sections, one scroll)

01 Introduction — the hook, plus the parents' line as a hand-drawn shout
   in the margin
02 Where I Came From — the narrative spine, beats with margin material
   (game chips, the roster, an aside) set beside them
03 What I've Been Doing Since — the work and the authority for it. Stat
   row, then a ruled module grid, then a plate, then the beliefs. No
   company named.
04 Outside the Game — playful, photo-driven, annotation-style captions,
   closing on the "I love my mom" coda
05 Elsewhere — quiet close, contact links, tap-to-copy email

Fixed chapter nav (01→05) tracks scroll position.

**Section 03 is a ruled editorial grid, explicitly not a bento of cards.**
The first version of this section was four paragraphs in two columns and
was rejected for reading as prose rather than as something scannable. What
replaced it has two deliberately different registers:

- *What that's looked like* — four modules (Programs, Coaching, Competition,
  Curriculum) on a 12-column grid, spans alternating 7/5 then 5/7 so the
  proportions read as a spread rather than a tile layout. Square corners,
  hairline rules shared between cells, no fills, no shadows, no icons, no
  rounded anything. Each module holds a mono label at the top and a Fraunces
  line at the foot, with the whitespace between doing the work. Borders sit
  on the cells rather than using a gap-and-background trick, because each
  module reveals independently and a hidden cell has to leave clean paper
  behind it.
- *What I've come to believe* — no boxes at all, on purpose; the grid above
  already spent that device. Four full-width ruled rows, each with an
  oversized ghost numeral (26% ink, a page-number weight) beside the
  statement. This is the "separate visual moment" the two halves needed.

A letterboxed plate sits between them and splits the section in two.
**Do not add per-module metrics.** Numbers next to each module would look
right, but there is no data for them and inventing it is not an option; the
stat row carries the only two figures that exist.

**Pacing is a requirement, not a preference.** The whole thing has to land
in under a minute. Sections size to their content — they are explicitly not
min-height: 100vh, which paced the earlier draft at roughly one idea per
screen and made it far too slow. Secondary material goes in the margin
column beside the narrative (the `.spread` pattern), never stacked beneath
it. When adding content, add it to a margin, not to the scroll.

## Known content/asset details

- The close-up League photo (orange jerseys, mid-match) is the strongest
  candidate for section 02's competition beat.
- Section 03 needs a program photo — coaching, a camp, or a league night.
- The five teammates are credited by tag in section 02: Willwin, Faith,
  xKace, TheJons, Keen.

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
  **The brand-collision caveat is now moot.** The original worry was that
  vermilion would be confused with EKUZO's orange; that test was never run
  (ekuzo.gg was unreachable from the build session). Since no company is
  named or linked on the site any more, there is nothing left to collide
  with. Oxblood `#8C2F2A` remains recorded as the fallback if the concern
  ever returns.

- **Typography: Fraunces (voice) + IBM Plex Mono (apparatus).** Self-hosted
  via npm, no CDN. The rule is that the two never overlap: Fraunces sets
  narrative only — hero, story beats, headings, closing line — and Plex Mono
  sets everything structural — chapter numerals, eyebrows, captions, links.
  Nothing is set in a neutral sans.
  Rationale: the brief wants warmth and weirdness *and* "precise typographic
  rhythm," which pull against each other. Splitting the roles resolves it —
  Fraunces absorbs all the personality (WONK 1 swaps in the splayed `g` and
  angled terminals; SOFT 28 rounds the terminals), while a fixed-width face
  enforces the rhythm structurally. Fraunces' `opsz` axis is why it beat
  Instrument Serif: with `font-optical-sizing: auto` the 5.5rem hero and a
  1.75rem beat get genuinely different cuts instead of one set of shapes
  scaled, which is the rhythm argument done by the typeface rather than by
  hand. Cost: 151 KB total on first load, 0 third-party requests.
  **Re-checked against arjun-r.com and kept.** Matching the reference site's
  own typeface was raised and dropped: the site was unreachable from the
  build environment, so the face was never identified. The owner compared
  the specimen against arjun-r.com himself and judged this pairing close
  enough. Recorded as his call on a visual comparison — not a verified
  match, since no one on the build side ever saw the reference type.

- **Copy: rewritten from the owner's own draft.** The text is his, lightly
  edited for grammar and length; it is not invented voice. Accent falls on
  exactly one phrase in the whole site — "worth being good at" — because
  that's the hinge the narrative turns on. "For gaming." is carried by scale
  rather than colour, deliberately: two shouts in one section cancel each
  other out.
  **Edits made to his draft, all of which he should sanity-check:**
  "my exposition" → "my way out" (the original reads as a slip for
  "exposure"; the replacement keeps the intended sense of games being both
  escape *and* the way outward). "The thing that I was hated for was finally
  seen and treated the way I loved as worth being good at" was two merged
  constructions and is now "The thing I'd been told to stop doing was
  finally treated as worth being good at". "what happens what you take" →
  "when you take". The fourth work bullet ended mid-phrase ("social, skills,
  and developmental") and was completed as "social skills and development".
  **Nothing was invented.** Earlier drafts carried made-up colour ("landing
  maybe one in four") — all of it is gone, replaced by his own text.

## OPEN — do not decide these unilaterally

- **Section 05 handles.** Email, LinkedIn, and Instagram are still `[TODO]`
  in index.html. Deliberately not filled in — publishing a personal email
  address is the user's call, not a default. The tap-to-copy handler in
  main.ts no-ops while the `[TODO` guard is present, so the page is safe to
  ship in this state; it starts working the moment a real address lands.
- **The seal mark.** Still only a "possibly" in the Asian-influence note
  above. Nothing has been built. The accent colour was chosen partly on the
  logic that vermilion *is* seal ink, so if the mark never ships, that
  argument goes partly unspent.
- **The doodles are hand-authored SVG, and they have a ceiling.** Six of
  them: mom in section 01, and the five teammates in section 02's roster.
  All share one drawing language (`.dood*` in sections.css) — heavy
  round-capped line, one face path and eye placement across the whole set,
  solid fill for dark hair, a lighter fill for fair hair (which is the only
  way hair colour reads when everything is drawn in a single ink).
  Each is drawn to the two or three features that actually tell the person
  apart — hair shape, glasses, mouth — and **not to a likeness**. Faith's
  spikes, Keen's rectangular frames and mid-kiss, xKace's bowl cut, Willwin's
  bob and wire frames, TheJons' curls and grin. At the size they render
  (~58px) that's enough to identify who's who, which is what they're for.
  If proper likenesses are wanted, that's an illustrator, not more bezier
  fiddling. Swapping them is a file drop — the layout doesn't change.
- **Game titles are set as type, not logos.** The brief floated using the
  League and Call of Duty logos. Those are trademarks belonging to Riot and
  Activision, so they're set as mono chips instead. Using the real marks is
  a permissions question, not a design one.

## Assets still needed from the user

- Backflip video
- Bouldering/climbing photos
- Piano/cello photo or clip
- Honda S2000 AP2 photos
- More candid/informal personal photos (everything currently on hand is
  event/press photography — section 04 needs unposed material)
- Additional League/UTD esports photos beyond what's already provided
- A program photo for section 03 — coaching, a camp, or a league night
- EKUZO logo + program/coaching photos beyond the poster
- LinkedIn, Instagram, and email for section 05
