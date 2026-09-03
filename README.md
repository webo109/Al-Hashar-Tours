# Al-Hashar Tourism & Travels, demo site

A bilingual (English / Arabic, true RTL) marketing and booking site built as an unsolicited demo for Al-Hashar Tourism & Travels LLC, Muscat. Every price, itinerary, phone number and branch on the site was taken from the company's public pages in September 2026; sources sit next to the data in `src/data`.

## Pages

| Route | What it does |
|---|---|
| `/en`, `/ar` | Cinematic home: layered hero with the boarding-pass request panel, pinned story stack of six real tours, Umrah band, services bento (the one cream chapter), trust chapter, logo moment |
| `/tours` | Catalog of the 15 published Oman products with search, type and region filters, sorting |
| `/tours/[slug]` | Tour detail: itinerary, inclusions, hotel tiers, gallery, sticky price card |
| `/book/[slug]` | Request-to-book wizard: date, travellers and hotel tier, details, review, WhatsApp / email handoff. Items without a published price redirect to the detail page |
| `/bookings/lookup` | Find a request by reference (stored in the browser for the demo) |
| `/umrah`, `/services/[slug]`, `/contact` | Umrah packages, six service pages, branches and contact channels, each with an inquiry form |

## Stack

Next.js 16 (App Router), Tailwind CSS v4, next-intl 4 (`/en` default, `/ar`), GSAP ScrollTrigger + Lenis for the pinned and scrubbed chapters, Motion for in-view reveals, Phosphor icons, `next/image` with locally optimised WebP photography.

## Scripts

```bash
npm run dev        # next dev --webpack
npm run build      # next build --webpack
npm run typecheck  # tsc --noEmit
npm run lint
npm run photos     # fetch source photos (Unsplash / Pexels) and regenerate public/images + src/data/images.generated.ts
```

`--webpack` is required on the development machine because a Windows Application Control policy blocks Next's native SWC binary; Turbopack needs it. Vercel builds are unaffected.

## Content and data

- `src/data/tours.ts` holds the catalog shape, prices and images; `tours.en.ts` / `tours.ar.ts` hold the copy per language.
- `src/data/company.ts` holds verified contact details, branches and socials with source URLs.
- `messages/en.json` and `messages/ar.json` hold all interface copy.
- `public/images/CREDITS.md` credits every photographer.

## Deployment

Linked to the Vercel project `al-hashar-travels`. Deploy with `vercel deploy` (preview) or `vercel --prod`.
