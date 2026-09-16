// Content of the internal QA report at /test-report. Everything here describes
// this build truthfully: real bugs, real decisions, real open items.

export type FeatureStatus = "working" | "needsSwap" | "postSale";

export type SmokeResult = {
  path: string;
  cls: string;
  status: number;
  ms: number;
  pass: boolean;
  location: string | null;
};

export type SmokeReport = {
  base: string;
  generatedAt: string;
  total: number;
  passed: number;
  results: SmokeResult[];
};
export type DecisionStatus = "open" | "confirmedYes" | "confirmedNo" | "shipped" | "deferred";

export const report = {
  version: "0.4",
  generated: "6 September 2026",
  client: "Al-Hashar Tourism & Travels LLC",
  liveUrl: "https://al-hashar-travels.vercel.app",

  features: [
    { name: "Bilingual routing", detail: "/en and /ar with next-intl, hreflang alternates, English default", status: "working" },
    { name: "True RTL", detail: "Arabic pages mirror layouts through logical CSS properties; IBM Plex Sans Arabic", status: "working" },
    { name: "Layered hero", detail: "Sky gradient, masked Al Hajar plane, Mutrah plate, dune foreground overlapping the panel, GSAP parallax", status: "working" },
    { name: "Boarding-pass request panel", detail: "Flights, hotels, Oman tours, holidays tabs; validation; prints a stub and composes WhatsApp + email", status: "working" },
    { name: "Story stack", detail: "Pinned chapter where six real tours walk toward the viewer as the copy crossfades; static list on mobile and under reduced motion", status: "working" },
    { name: "Umrah band", detail: "Arch reveal of the Haram at night, inclusions, link to the Umrah page", status: "working" },
    { name: "Services bento", detail: "Eight services in a twelve-column bento, the page's single cream chapter with photo tiles", status: "working" },
    { name: "Trust chapter", detail: "Since 1984, branch count and IATA accreditation over a dusk mountain plane", status: "working" },
    { name: "Logo moment", detail: "Scrubbed entrance of the compass-and-plane mark over topographic contours, resolving into the footer", status: "working" },
    { name: "Tours catalog", detail: "15 published products, search, type and region filters, four sort orders, count", status: "working" },
    { name: "Tour pages", detail: "Story, highlights, itinerary, inclusions, exclusions, hotel categories, notes, gallery, related journeys", status: "working" },
    { name: "Price tiers", detail: "Packages show the three hotel tiers as published; day tours show per-car or per-person basis", status: "working" },
    { name: "Currency approximations", detail: "USD, EUR and GBP estimates from the OMR peg on every price", status: "working" },
    { name: "Request-to-book wizard", detail: "Date with calendar and quick picks, travellers and hotel tier, details, review, confirmation with reference", status: "working" },
    { name: "Estimate", detail: "Adults times tier price, or vehicles times per-car price; labelled as an estimate", status: "working" },
    { name: "WhatsApp handoff", detail: "api.whatsapp.com deep link to +968 9558 7789 with the full request; email fallback to sales@", status: "working" },
    { name: "Request lookup", detail: "Find a request by reference; stored in the browser for the demo", status: "needsSwap" },
    { name: "Umrah page", detail: "Inclusions, how it works, request form with month, pilgrims and hotel preference", status: "working" },
    { name: "Service pages", detail: "Flights, hotels, holidays, visa, insurance, cargo with division phone lines and inquiry forms", status: "working" },
    { name: "Contact page", detail: "Head office, WhatsApp, divisions and the 11 named branches", status: "working" },
    { name: "Metadata", detail: "Per-page titles and descriptions in both languages, Open Graph, canonical and alternates", status: "working" },
    { name: "Photography pipeline", detail: "25 licensed photos fetched, resized and converted to WebP with blur placeholders and a credits file", status: "needsSwap" },
    { name: "Reduced motion", detail: "Every pinned or scrubbed chapter collapses to a static layout under prefers-reduced-motion", status: "working" },
    { name: "Static output", detail: "All public pages prerendered at build time; locale proxy in front", status: "working" },
    { name: "Light and dark themes", detail: "Follows the device by default, toggle in the nav remembers the choice, every chapter has a daylight and a night grade", status: "working" },
    { name: "Ambient hero video", detail: "A muted drone loop over the hero photograph, loaded after the page, with a pause control; the photo is the poster and fallback", status: "needsSwap" },
    { name: "Hover-to-play clips", detail: "Featured tour cards and the active story pane play a short clip, at most two at once, none under reduced motion or Save-Data", status: "needsSwap" },
    { name: "Glass hero with the picker", detail: "A frosted card over one full-bleed clip is the first screen; three taps (place, time, pace; mood for abroad) suggest three journeys inside it, keyboard operable, with a confetti burst", status: "working" },
    { name: "World destinations", detail: "All 21 published international packages with prices, a scroll-snap rail of 19 with photos, each preselecting the holidays request", status: "working" },
    { name: "People imagery", detail: "Family-and-friends moments as polaroid insets in the story stack and on the holidays and hotel tiles", status: "needsSwap" },
    { name: "Micro-interactions", detail: "Paper plane along a scroll route, pointer tilt and cursor glow on photo cards, confetti on every sent request", status: "working" },
    { name: "Reviews chapter", detail: "Built, hidden until verifiable third-party reviews exist", status: "postSale" },
    { name: "Payments", detail: "Not in the demo by design; part of activation", status: "postSale" },
  ] as { name: string; detail: string; status: FeatureStatus }[],

  fixes: [
    {
      title: "Hero photo plate collapsed to zero height",
      before: "A custom .grade rule set position: relative outside Tailwind's layers, so it beat the absolute utility and the fill image lost its box.",
      after: "All custom classes live in @layer components; utilities always win. The Mutrah plate renders and the hero has its depth.",
    },
    {
      title: "Turbopack could not start on the build machine",
      before: "A Windows Application Control policy blocks Next's native SWC binary. Next fell back to WASM bindings and Turbopack refused to run.",
      after: "dev and build scripts use the webpack bundler locally. Vercel builds on Linux with native bindings and is unaffected.",
    },
    {
      title: "Umrah arch never revealed",
      before: "The Motion in-view animation on clip-path never fired although sibling opacity reveals did; the image stayed fully clipped.",
      after: "The arch reveal and the copy stagger run on GSAP ScrollTrigger, the same engine as the other pinned chapters.",
    },
    {
      title: "Foreground dune did not embed the booking panel",
      before: "On desktop the visible ridge started 17px below the panel; on a 375px phone it covered 150px of the panel including its stub.",
      after: "Plane height and mask are set per breakpoint: about 60px of deliberate overlap on desktop, 25px on phones.",
    },
    {
      title: "React Compiler lint failures",
      before: "The smooth-scroll provider and the nav called setState synchronously inside effects, which the new react-hooks rules reject.",
      after: "The Lenis instance is shared through a ref-based context; the redundant pathname effect was removed. Lint is clean.",
    },
    {
      title: "Typed locale rejected route params",
      before: "next-intl's typed Locale refused the plain string coming from the route, failing the type check in layouts and pages.",
      after: "A resolveLocale helper validates the param and calls notFound() for anything outside en and ar.",
    },
    {
      title: "Story stack heading hidden under the floating nav",
      before: "The pinned frame centred its content, so the chapter label sat behind the navigation bar.",
      after: "The frame carries top padding equal to the nav height plus breathing room.",
    },
    {
      title: "Language toggle lost the page",
      before: "Switching language always returned to the home page.",
      after: "The toggle links to the current pathname in the other locale.",
    },
    {
      title: "Video optimiser could not find its sources on Windows",
      before: "Paths were derived from URL pathnames, so the space in the project folder arrived percent-encoded and every clip was skipped.",
      after: "Paths go through fileURLToPath; the three provisional clips encode to 1.7 MB, 0.6 MB and 0.3 MB with posters.",
    },
    {
      title: "Pinned chapters broke behind the paper plane",
      before: "The plane's overflow-hidden wrapper on the page made main a scroll container, which disables position: sticky for the story stack and logo moment.",
      after: "overflow-clip clips the route without creating a scroll container; the stack pins again at desktop sizes.",
    },
  ],

  session: [
    { phase: "Discovery", detail: "Five rounds of questions settled the build location, scope, imagery, stack, languages, page structure and signature moves." },
    { phase: "Research", detail: "Verified contacts, head office, branches, IATA claim, socials, all 15 published products with prices and itineraries; sourced 25 licensed photographs." },
    { phase: "Foundation", detail: "Next.js 16, Tailwind v4, next-intl with /en and /ar, design tokens, fonts, Lenis + GSAP, floating nav." },
    { phase: "Hero", detail: "Layered scene with masked photo planes and the boarding-pass request panel, entrance and parallax choreography." },
    { phase: "Pivot to multi-page", detail: "Catalog, tour pages, request-to-book wizard and lookup, modelled on the concept of the Sunshine Tours build, redesigned for this brand." },
    { phase: "Home chapters", detail: "Story stack, Umrah band, services bento, trust chapter, logo moment." },
    { phase: "Secondary pages", detail: "Umrah, six service pages, contact, footer, inquiry forms." },
    { phase: "Verification and deploy", detail: "Type check, lint, production build, booking flow, both languages, mobile overflow, then Vercel." },
    { phase: "Internal tools", detail: "This report with a smoke-test battery, and the operator dashboard preview." },
    { phase: "Alive", detail: "Light and dark themes, ambient and hover video with an ffmpeg pipeline, the adventure picker, the world rail of real packages, people imagery, plane, tilt and confetti." },
    { phase: "Glass hero", detail: "One crisp full-bleed clip with a frosted card holding the picker as the first screen; the boarding pass moves to its own band." },
  ],

  swaps: [
    { what: "Client photography in place of stock", where: "scripts/photos.manifest.mjs, then npm run photos", effort: "30 min" },
    { what: "Real video clips (hero, six tours, three world cards)", where: "assets/videos-src/{key}.mp4, then npm run videos", effort: "40 min" },
    { what: "Family and friends photos of real guests", where: "assets/photos-src/people-*.jpg, then npm run photos", effort: "20 min" },
    { what: "Arabic copy review by a native reader", where: "messages/ar.json, src/data/tours.ar.ts", effort: "40 min" },
    { what: "Confirm 12 branches (contact page names 11 plus head office)", where: "src/data/company.ts", effort: "5 min" },
    { what: "World Travel Awards: winner or nominee for 2025", where: "Trust chapter, About copy", effort: "5 min" },
    { what: "Child pricing on packages", where: "BookingWizard estimate", effort: "15 min" },
    { what: "Umrah package dates and prices", where: "Umrah page", effort: "20 min" },
    { what: "Custom domain and mailbox for requests", where: "Vercel project, company.ts", effort: "15 min" },
    { what: "Real reviews, if any exist on Google or Tripadvisor", where: "src/data/reviews.ts", effort: "15 min" },
  ],

  gaps: {
    theirs: [
      "WordPress pages their staff can edit without a developer",
      "Safariyati booking app promotion and links",
      "World Travel Awards badge on the home page",
      "About page listing the management team",
      "International holiday package listings under Packages",
    ],
    ours: [
      "Arabic interface with true RTL",
      "On-site request flow with reference numbers and WhatsApp handoff",
      "Tour pages with itineraries readable without tabs",
      "Mobile layout without overflow or blocking popups",
      "Photography of Oman instead of airline stock",
    ],
    both: [
      "Online payment",
      "Live seat and room availability",
      "Customer accounts",
      "Verified customer reviews on the site",
      "Structured data for tours in search results",
    ],
  },

  roadmap: {
    tier1: [
      { title: "International holidays catalog", impact: "Their Packages menu becomes browsable and requestable like Oman tours", effort: "4 h", files: "src/data/holidays.ts, app/[locale]/holidays" },
      { title: "Currency switcher", impact: "Prices in USD, EUR or GBP by preference instead of approximations only", effort: "1 h", files: "components/tours/PriceText.tsx" },
      { title: "Per-branch WhatsApp deep links", impact: "Requests route to the nearest branch", effort: "1 h", files: "src/data/company.ts, contact page" },
      { title: "Request analytics", impact: "Know which pages produce WhatsApp requests", effort: "1 h", files: "lib/whatsapp.ts, Vercel Analytics" },
      { title: "Structured data and sitemap", impact: "Tour pages eligible for rich results", effort: "1 h", files: "app/sitemap.ts, tour page JSON-LD" },
    ],
    tier2: [
      { title: "Editable content", impact: "Staff edit tours and prices without a developer", effort: "6 h", files: "Sanity or Notion source for src/data" },
      { title: "Umrah departures", impact: "Dated groups with prices and seats left", effort: "3 h", files: "umrah page, data" },
      { title: "About page", impact: "Company story since 1984 and the verified management team", effort: "2 h", files: "app/[locale]/about" },
      { title: "Branch map", impact: "Twelve branches on a map with directions", effort: "2 h", files: "contact page" },
    ],
    tier3: [
      { title: "Online payments", reason: "Sold as activation: Thawani or Tap plus Stripe, with a database behind it" },
      { title: "Live GDS inventory", reason: "Airline and hotel availability needs supplier contracts, not a demo" },
      { title: "Customer accounts", reason: "Requests by reference cover the need for now" },
      { title: "Loyalty and promo codes", reason: "Overengineered before the first hundred bookings" },
    ],
  },

  decisions: [
    { q: "Build in Lovable or in code?", status: "confirmedYes", resolution: "Built from scratch in code; Lovable output was exactly the look to avoid." },
    { q: "One scrolling page or a multi-page site?", status: "confirmedYes", resolution: "Multi-page with catalog and booking, after reviewing the first hero." },
    { q: "Keep Musandam in the featured stories?", status: "confirmedNo", resolution: "Replaced with Jebel Shams: Al-Hashar sells no Musandam product." },
    { q: "Show a reviews chapter?", status: "deferred", resolution: "Hidden until verifiable reviews exist; no invented quotes." },
    { q: "Generated video for a living hero?", status: "deferred", resolution: "Not for v1; the hero is code-driven over real photography." },
    { q: "Arabic spelling of the company name", status: "confirmedYes", resolution: "الحشار, applied across the site." },
    { q: "World Travel Awards claim", status: "open", resolution: "Nomination verified, win not; left off until confirmed." },
    { q: "Child pricing on packages", status: "open", resolution: "Estimate counts adults only and says so." },
    { q: "Custom domain", status: "open", resolution: "Live on al-hashar-travels.vercel.app for the pitch." },
    { q: "Light theme", status: "shipped", resolution: "Both themes with a toggle; the device preference decides first." },
    { q: "Video footage", status: "open", resolution: "Provisional Pexels clips prove the pipeline; the client's or hand-picked clips replace them by filename." },
    { q: "International destinations", status: "shipped", resolution: "The 21 packages and prices published on their Holidays page, not a generic list." },
  ] as { q: string; status: DecisionStatus; resolution: string }[],

  pricing: {
    models: [
      { name: "Single-tier flat fee", summary: "One number for the build and a 30-day handoff.", pros: "Simple yes or no", cons: "No recurring revenue, harder haggling", range: "$700 to $900" },
      { name: "Good / Better / Best", summary: "Three options at climbing prices.", pros: "Middle tier feels safe", cons: "Decision fatigue, may pick the cheapest", range: "$400 / $700 / $1,200" },
      { name: "Phase-based", summary: "Build, activation and retainer, each justifying its own number.", pros: "Recurring revenue from month one; each line defensible", cons: "Three numbers to explain", range: "$500 + $300 + $50 per month", recommended: true },
    ],
    structure: [
      { line: "Build", amount: "$500", covers: "Everything in the demo: code, content, design, both languages, this report and the dashboard preview. Already done; the fee covers delivery, walkthrough and the first month of support." },
      { line: "Activation", amount: "$300", covers: "Thawani or Tap plus Stripe, a real database for requests, email and WhatsApp Business notifications, custom domain, staff walkthrough. About one week." },
      { line: "Retainer", amount: "$50 per month", covers: "Hosting, monitoring, fixes, content and price updates, a monthly check. Cancel any time." },
    ],
    anchor: "Your Glimpse Oman package is OMR 123 per adult. One couple booking it is OMR 246, about $640. The build fee is one of those bookings.",
    ladder: [
      { rung: 1, build: "$500", activation: "$300", retainer: "$50/mo", when: "Open here, confident" },
      { rung: 2, build: "$450", activation: "$300", retainer: "$50/mo", when: "First push back" },
      { rung: 3, build: "$400", activation: "$300", retainer: "$50/mo", when: "Second push back" },
      { rung: 4, build: "$300", activation: "$250", retainer: "$40/mo", when: "Floor. Walk politely below this" },
    ],
    dontDo: [
      "Quote ranges",
      "Quote hourly",
      "Offer free trials",
      "Quote on the cold call",
      "Budge on the 50% deposit",
      "Volunteer the next ladder step",
      "Apologise for the price",
      "Discount for signing today",
    ],
  },

  meeting: [
    { title: "Schedule the meeting", when: "First", detail: "Thursday afternoon or Sunday morning, binary choice." },
    { title: "Run the demo on the actual laptop", when: "Day before", detail: "Home, a tour page, the wizard to the WhatsApp step, the dashboard." },
    { title: "Pre-load the dashboard", when: "Day before", detail: "Open /admin once so images are cached." },
    { title: "Print this report's smoke table", when: "Day before", detail: "One page. Numbers beat adjectives." },
    { title: "Open three tabs in advance", when: "Just before", detail: "/en, /ar/tours, /admin." },
    { title: "Hard reload everything", when: "Just before", detail: "Ctrl+Shift+R on each tab." },
    { title: "Phone with WhatsApp ready", when: "Just before", detail: "Send one request live from the site to your own number." },
    { title: "Do not say AI-built", when: "During", detail: "Talk about their data, their prices, their branches." },
    { title: "Do not quote a range", when: "During", detail: "Say the number once, then stop talking." },
    { title: "Ask for the 50% deposit", when: "During", detail: "The trust check. No exceptions." },
  ],

  outOfScope: {
    critical: [
      "Payments: Thawani or Tap for OmanNet cards plus Stripe for international",
      "Database for requests (Supabase or Neon) replacing browser storage",
      "Customer confirmations by email (Resend) and WhatsApp Business API",
      "Staff notifications for new requests",
      "Custom domain, for example book.alhashartravels.com",
    ],
    operations: [
      "Availability calendar and capacity per product",
      "Umrah group management with visa status",
      "Refunds and cancellations",
      "Photo upload from the dashboard",
      "Daily backups",
    ],
    marketing: [
      "Analytics",
      "Sitemap, robots and structured data",
      "International holidays catalog",
      "Blog or news",
    ],
    retainer: [
      "Instagram feed embed",
      "Promo codes",
      "Customer accounts",
      "Per-branch pages",
    ],
  },

  stack: [
    "Next.js 16, App Router",
    "React 19",
    "TypeScript 5",
    "Tailwind CSS 4",
    "next-intl 4",
    "GSAP 3 + Lenis",
    "Motion 13",
    "Phosphor icons",
    "sharp image pipeline",
    "Vercel",
  ],
};
