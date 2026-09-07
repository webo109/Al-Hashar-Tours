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
_Pending._

### 2. Problem Statement
_Pending._

### 3. BookingBand
_Pending._

### 4-6. Solution/Value chapter
_Pending._

### 7. How it Works
_Pending._

### 8. TrustChapter
_Pending._

### 9. FAQ
_Pending._

### 10. LogoMoment
_Pending._
