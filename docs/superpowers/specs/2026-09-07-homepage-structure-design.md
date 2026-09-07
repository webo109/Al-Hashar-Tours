# Homepage structure — design

Date: 2026-09-07
Status: skeleton approved; per-section design details to be filled in as work proceeds.

## Goal

Restructure the homepage to follow a landing-page framework (Hero → Social Proof →
Problem → Solution/Value → How it Works → FAQ → CTA) while reusing the sections that
already exist, keeping their identity, and preserving the page's lighting narrative.

## Constraint that shaped the design

The current sections already sit in a framework-compatible order, so the skeleton
below **reorders nothing**. Every framework gap is filled by insertion. This keeps the
page's dark → daylight → dusk → night background story intact, which a reorder would
have broken (each section's gradient is tuned to its neighbours).

## Locked skeleton

| # | Section | Component | Framework role | Change |
|---|---------|-----------|----------------|--------|
| 1 | Hero | `components/hero/Hero.tsx` | Hero | Tune copy: end result + "without the juggling"; add a thin proof strip (since 1984 · IATA · branches) inside the glass card |
| 2 | Problem Statement | 🆕 new | Problem | The cost of coordinating visas, flights, hotels and tours yourself |
| 3 | BookingBand | `components/hero/BookingBand.tsx` | early CTA | Tune headline to benefit-driven; stays a booking shortcut |
| 4 | WorldRail | `components/home/WorldRail.tsx` | Solution/Value | Chapter framing only |
| 5 | UmrahBand | `components/home/UmrahBand.tsx` | Solution/Value | Chapter framing only |
| 6 | ServicesChapter | `components/home/ServicesChapter.tsx` | Solution/Value | Chapter framing only; the 8-tile grid is the feature set |
| 7 | How it Works | 🆕 new | How it Works | 1-2-3 process |
| 8 | TrustChapter | `components/home/TrustChapter.tsx` | Social Proof | Tune: add review quotes beside the existing stats |
| 9 | FAQ | 🆕 new | FAQs | Visas, payment, changes, support |
| 10 | LogoMoment | `components/home/LogoMoment.tsx` | CTA | Tune into a benefit-driven close; it already ends on a CTA |

Sections 4-6 are consecutive already, so grouping them as one Solution/Value chapter
needs framing, not movement.

## Deliberate deviations from the framework

1. **Social proof lands at #8, not #2.** Mitigated by the proof strip added to the hero.
   Moving `TrustChapter` up would break the lighting narrative for a benefit the hero
   strip already delivers.
2. **An early CTA at #3 that the framework does not have.** Visitors who already know
   what they want should not scroll eight sections to book.

## Deferred: the full restructure

If the framework's literal order is wanted after the tuned version ships: move
`TrustChapter` to #2 and re-tune four background gradients between the new neighbours.
That is the entire structural delta. Defer until the tuned page is live and judgeable.

## Length

The page goes from 7 beats to 10. If that reads long, the cheapest merge is folding
**How it Works** into `BookingBand` at #3, with the boarding pass as step 1 — back to 9.

## Working agreement

- Per-section elements, design and animation are supplied by the user before that
  section is built. This document records them as they arrive.
- Every section is built and validated in **desktop and mobile** viewports.
- New copy ships in **both locales** (`messages/en.json`, `messages/ar.json`); Arabic
  is RTL and some components switch font by locale.

## Per-section design details

Filled in as each section is specified.

### 1. Hero

**Journey carousel — built 2026-09-07.** `components/home/JourneyCarousel.tsx`.

From a reference the user supplied: a centre-focused card with its neighbours
peeking in at both edges, over a heavily blurred copy of the active card's own
photograph. The story-app styling of the reference was dropped; only the mechanic
was taken.

It lives on the picker's **results** step rather than the hero's idle state, so the
video intro and the "picker as first screen" decision both survive. In a live pitch
the demo always walks through the three taps, so the payoff gets seen.

- `PickerFlow` gained an optional `onActive` reporting the journey on show. The
  standalone panel variant still renders the old grid; only the glass variant gets
  the carousel.
- The hero holds that image and paints it blurred behind the stage, carrying the
  same bottom fade so the hero still melts into the page.
- The glass card keeps its class in the results state (its custom properties carry
  the light-on-dark palette) but has its chrome dissolved inline and widens to
  1180px, so the carousel floats free of the box.
- The hero's label, h1 and intro collapse once results show: they are redundant
  beside "Three journeys for you", and reclaiming that height is what lets the whole
  results state fit one mobile screen.

Validated at 458px and 1024px, English and Arabic RTL. In RTL the rail mirrors and
the arrows follow the writing mode; advancing the carousel swaps the backdrop plate.

**Still pending:** the copy tune and the proof strip (see the table above). Note the
proof strip is load-bearing — it is the stated mitigation for Social Proof landing
at #8 instead of #2.

### 2. Problem Statement — built 2026-09-07

`components/home/ProblemChapter.tsx`, messages under `Problem`.

The four pains are the exact inverse of the four `Trust` promises, so the problem
named at the top of the page is answered by the Social Proof chapter further down
(consultant → counselling, hidden price → competitive pricing, nobody at 2am →
24/7 assistance). Nothing is invented and no statistics are claimed; the copy only
describes what booking a trip yourself is like, which keeps the "verifiable claims
only" rule intact.

The closing line — "You wanted a holiday. You got a project." — hands over to the
BookingBand at #3, whose existing subtitle is already "Tell us where. We handle the
rest.", so the relief beat needed no new copy.

Layout: text left, muted photograph right spanning both rows. On mobile the image
sits between the intro and the list, breaking up an otherwise long text block.
Motion is `Reveal` (Motion in-view), not GSAP, per the convention in `Reveal.tsx`
that GSAP is for pinned and scrubbed chapters only.

Photo `extra-airport-wait` (Pexels, André Gustavo de Castro) is deliberately outside
the page's standard `.grade`: a flat scrim in the surface colour turned it milky in
light mode, so it instead fades into the surface at its bottom edge only.

Validated at 458px and 1024px, in light and dark, in English and Arabic RTL.

### 3. BookingBand
_Pending._

### 4-6. Solution/Value chapter
_Pending._

### 7. How it Works
_Pending._

### 8. TrustChapter

**Correction to the table above.** It says "add review quotes", which conflicts with
a standing project decision: the reviews chapter was hidden because no verifiable
third-party reviews exist, and claims must stay verifiable. So no testimonials.

The Social Proof slot is instead carried by facts that can be sourced: trading since
1984, 12 branches (11 named on their contact page plus the head office), IATA
accreditation, and the Al-Hashar Group parentage. Physical presence across Oman is
the strongest honest proof available. Details pending.

### 9. FAQ
_Pending._

### 10. LogoMoment
_Pending._
