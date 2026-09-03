// Al-Hashar's published Oman products (alhashartravels.com/oman-tours-details,
// September 2026). Prices, inclusions and itineraries follow their page;
// nothing here is invented. Text lives in tours.en.ts / tours.ar.ts.

import type { ImageKey } from "./images.generated";

export type TourKind = "package" | "day" | "sea";
export type PriceBasis = "adultTwin" | "adult" | "person" | "car";
export type RegionKey =
  | "muscat"
  | "dakhiliyah"
  | "sharqiyah"
  | "batinah"
  | "acrossOman";

export type TourBase = {
  slug: string;
  kind: TourKind;
  regions: RegionKey[];
  image: ImageKey;
  gallery: ImageKey[];
  nights: number | null;
  days: number | null;
  hours: number | null;
  startTime: string | null;
  endTime: string | null;
  priceFrom: number | null;
  priceBasis: PriceBasis | null;
  maxPersons: number | null;
  // Multi-day packages are quoted per adult on twin share for three hotel tiers.
  priceTiers: { tier: "3star" | "4star" | "4starPlus"; price: number }[] | null;
  featured: number | null;
  popularity: number;
};

export const tours: TourBase[] = [
  {
    slug: "quickie-oman",
    kind: "package",
    regions: ["muscat"],
    image: "dest-muscat-skyline",
    gallery: ["dest-muscat-skyline", "grand-mosque-chandelier", "dest-muscat-mutrah"],
    nights: 3,
    days: 4,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 72,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 72 },
      { tier: "4star", price: 79 },
      { tier: "4starPlus", price: 99 },
    ],
    featured: null,
    popularity: 70,
  },
  {
    slug: "glimpse-oman",
    kind: "package",
    regions: ["muscat", "sharqiyah"],
    image: "dest-wahiba-dunes",
    gallery: ["dest-wahiba-dunes", "grand-mosque-chandelier", "dest-muscat-mutrah"],
    nights: 3,
    days: 4,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 123,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 123 },
      { tier: "4star", price: 135 },
      { tier: "4starPlus", price: 159 },
    ],
    featured: 3,
    popularity: 82,
  },
  {
    slug: "authentic-oman",
    kind: "package",
    regions: ["muscat", "sharqiyah"],
    image: "dest-wadi-shab-canyon",
    gallery: ["dest-wadi-shab-canyon", "dest-wahiba-dunes", "bimmah-sinkhole", "dest-muscat-mutrah"],
    nights: 3,
    days: 4,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 189,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 189 },
      { tier: "4star", price: 195 },
      { tier: "4starPlus", price: 215 },
    ],
    featured: null,
    popularity: 88,
  },
  {
    slug: "magnificent-oman",
    kind: "package",
    regions: ["muscat", "dakhiliyah", "sharqiyah"],
    image: "dest-muscat-mutrah",
    gallery: ["dest-muscat-mutrah", "jebel-shams-rim", "dest-wadi-shab-pool", "dolphins-muscat"],
    nights: 4,
    days: 5,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 192,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 192 },
      { tier: "4star", price: 209 },
      { tier: "4starPlus", price: 239 },
    ],
    featured: null,
    popularity: 76,
  },
  {
    slug: "historical-treasures-of-oman",
    kind: "package",
    regions: ["muscat", "dakhiliyah", "batinah"],
    image: "dest-nizwa-fort-sunset",
    gallery: ["dest-nizwa-fort-sunset", "dest-nizwa-fort-palms", "nakhal-fort", "extra-al-alam-palace"],
    nights: 4,
    days: 5,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 205,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 205 },
      { tier: "4star", price: 219 },
      { tier: "4starPlus", price: 239 },
    ],
    featured: null,
    popularity: 74,
  },
  {
    slug: "awesome-oman",
    kind: "package",
    regions: ["acrossOman"],
    image: "dest-jabal-akhdar-terraces",
    gallery: ["dest-jabal-akhdar-terraces", "jebel-shams-rim", "dest-nizwa-fort-palms", "dest-wahiba-dunes"],
    nights: 6,
    days: 7,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 399,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 399 },
      { tier: "4star", price: 411 },
      { tier: "4starPlus", price: 449 },
    ],
    featured: null,
    popularity: 80,
  },
  {
    slug: "enchanting-oman",
    kind: "package",
    regions: ["acrossOman"],
    image: "sur-lighthouse",
    gallery: ["sur-lighthouse", "dest-wahiba-dunes", "dolphins-muscat", "dest-wadi-shab-canyon"],
    nights: 6,
    days: 7,
    hours: null,
    startTime: null,
    endTime: null,
    priceFrom: 484,
    priceBasis: "adultTwin",
    maxPersons: null,
    priceTiers: [
      { tier: "3star", price: 484 },
      { tier: "4star", price: 499 },
      { tier: "4starPlus", price: 529 },
    ],
    featured: null,
    popularity: 78,
  },
  {
    slug: "coastal-road-tour",
    kind: "day",
    regions: ["sharqiyah"],
    image: "dest-wadi-shab-pool",
    gallery: ["dest-wadi-shab-pool", "bimmah-sinkhole", "dest-wadi-shab-canyon"],
    nights: null,
    days: 1,
    hours: 9.5,
    startTime: "08:30",
    endTime: "18:00",
    priceFrom: 105,
    priceBasis: "car",
    maxPersons: 3,
    priceTiers: null,
    featured: 5,
    popularity: 92,
  },
  {
    slug: "daymaniyat-islands",
    kind: "sea",
    regions: ["muscat"],
    image: "dhow-turquoise",
    gallery: ["dhow-turquoise", "extra-musandam-cliffs", "dolphins-muscat"],
    nights: null,
    days: 1,
    hours: 6,
    startTime: "08:30",
    endTime: "14:30",
    priceFrom: 44,
    priceBasis: "adult",
    maxPersons: null,
    priceTiers: null,
    featured: null,
    popularity: 84,
  },
  {
    slug: "dolphins-and-snorkelling",
    kind: "sea",
    regions: ["muscat"],
    image: "dolphins-muscat",
    gallery: ["dolphins-muscat", "extra-musandam-cliffs"],
    nights: null,
    days: 1,
    hours: 3,
    startTime: "09:45",
    endTime: null,
    priceFrom: 19,
    priceBasis: "person",
    maxPersons: null,
    priceTiers: null,
    featured: null,
    popularity: 86,
  },
  {
    slug: "great-fort-tour",
    kind: "day",
    regions: ["dakhiliyah"],
    image: "dest-nizwa-fort-palms",
    gallery: ["dest-nizwa-fort-palms", "dest-nizwa-fort-sunset"],
    nights: null,
    days: 1,
    hours: 9.5,
    startTime: "08:30",
    endTime: "18:00",
    priceFrom: 120,
    priceBasis: "car",
    maxPersons: 4,
    priceTiers: null,
    featured: 4,
    popularity: 83,
  },
  {
    slug: "muscat-moments",
    kind: "day",
    regions: ["muscat"],
    image: "extra-grand-mosque-corridor",
    gallery: ["extra-grand-mosque-corridor", "grand-mosque-chandelier", "extra-al-alam-palace", "dest-muscat-mutrah"],
    nights: null,
    days: 1,
    hours: 4,
    startTime: "08:00",
    endTime: "12:00",
    priceFrom: 55,
    priceBasis: "car",
    maxPersons: 3,
    priceTiers: null,
    featured: 1,
    popularity: 90,
  },
  {
    slug: "jabal-akhdar-day-tour",
    kind: "day",
    regions: ["dakhiliyah"],
    image: "dest-jabal-akhdar-village",
    gallery: ["dest-jabal-akhdar-village", "dest-jabal-akhdar-terraces", "dest-nizwa-fort-palms"],
    nights: null,
    days: 1,
    hours: 9.5,
    startTime: "08:30",
    endTime: "18:00",
    priceFrom: 110,
    priceBasis: "car",
    maxPersons: 4,
    priceTiers: null,
    featured: 2,
    popularity: 89,
  },
  {
    slug: "jebel-shams-grand-canyon",
    kind: "day",
    regions: ["dakhiliyah"],
    image: "jebel-shams-rim",
    gallery: ["jebel-shams-rim", "plane-hajar-sunset", "dest-nizwa-fort-palms"],
    nights: null,
    days: 1,
    hours: 9.5,
    startTime: "08:30",
    endTime: "18:00",
    priceFrom: 110,
    priceBasis: "car",
    maxPersons: 4,
    priceTiers: null,
    featured: 6,
    popularity: 85,
  },
  {
    slug: "nakhal-and-rustaq",
    kind: "day",
    regions: ["batinah"],
    image: "nakhal-fort",
    gallery: ["nakhal-fort", "plane-hajar-sunset"],
    nights: null,
    days: 1,
    hours: 9.5,
    startTime: "08:30",
    endTime: "18:00",
    priceFrom: 110,
    priceBasis: "car",
    maxPersons: 4,
    priceTiers: null,
    featured: null,
    popularity: 66,
  },
];

export const tourBySlug = (slug: string) => tours.find((t) => t.slug === slug);

export const featuredTours = () =>
  tours
    .filter((t) => t.featured !== null)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

// Approximate conversions from the Omani rial (pegged to the US dollar).
export const approxRates = { USD: 2.6, EUR: 2.4, GBP: 2.05 } as const;

export type TourContent = {
  name: string;
  tagline: string;
  summary: string;
  story: { headline: string; text: string } | null;
  highlights: string[];
  itinerary: { label: string; title: string; text: string }[];
  included: string[];
  excluded: string[];
  notes: string[];
  hotels: { place: string; options: string[] }[] | null;
};
