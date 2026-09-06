// Al-Hashar's published international holiday packages
// (alhashartravels.com/holidays, September 2026). Prices are OMR per adult on
// twin share as published. Names, cities and blurbs live in messages under
// World.items.{key}. Packages without a photo yet are listed by name only.

import type { ImageKey } from "./images.generated";

export type Mood = "beach" | "city" | "nature" | "culture";

export type WorldKey =
  | "india"
  | "georgia"
  | "switzerland"
  | "bosnia"
  | "istanbul"
  | "trabzon"
  | "dubai"
  | "thailand"
  | "malaysia"
  | "azerbaijan"
  | "greece"
  | "kenya"
  | "france"
  | "sriLanka"
  | "kerala"
  | "czechAustria"
  | "scandinavia"
  | "qatar"
  | "armenia"
  | "taiwan"
  | "indonesia";

export type WorldPackage = {
  key: WorldKey;
  image: ImageKey | null;
  clip: string | null;
  nights: number;
  days: number;
  priceFrom: number;
  moods: Mood[];
  featured: number | null;
};

export const world: WorldPackage[] = [
  { key: "india", image: "world-india", clip: null, nights: 5, days: 6, priceFrom: 183, moods: ["culture", "city"], featured: 1 },
  { key: "georgia", image: "world-georgia", clip: null, nights: 9, days: 10, priceFrom: 265, moods: ["nature", "culture"], featured: 2 },
  { key: "switzerland", image: "world-switzerland", clip: null, nights: 6, days: 7, priceFrom: 520, moods: ["nature"], featured: 3 },
  { key: "bosnia", image: "world-bosnia", clip: null, nights: 9, days: 10, priceFrom: 335, moods: ["nature", "culture"], featured: 4 },
  { key: "istanbul", image: "world-istanbul", clip: "clip-istanbul", nights: 10, days: 11, priceFrom: 350, moods: ["city", "culture"], featured: 5 },
  { key: "trabzon", image: "world-trabzon", clip: null, nights: 6, days: 7, priceFrom: 230, moods: ["nature"], featured: 6 },
  { key: "dubai", image: "world-dubai", clip: "clip-dubai", nights: 4, days: 5, priceFrom: 199, moods: ["city", "beach"], featured: null },
  { key: "thailand", image: "world-thailand", clip: null, nights: 5, days: 6, priceFrom: 155, moods: ["beach", "city"], featured: null },
  { key: "malaysia", image: "world-malaysia", clip: null, nights: 10, days: 11, priceFrom: 299, moods: ["city", "nature", "beach"], featured: null },
  { key: "azerbaijan", image: "world-azerbaijan", clip: null, nights: 6, days: 7, priceFrom: 134, moods: ["city", "culture"], featured: null },
  { key: "greece", image: "world-greece", clip: null, nights: 6, days: 7, priceFrom: 349, moods: ["beach", "culture"], featured: null },
  { key: "kenya", image: "world-kenya", clip: null, nights: 4, days: 5, priceFrom: 419, moods: ["nature"], featured: null },
  { key: "france", image: "world-france", clip: null, nights: 3, days: 4, priceFrom: 275, moods: ["city", "culture"], featured: null },
  { key: "sriLanka", image: "world-sri-lanka", clip: null, nights: 9, days: 10, priceFrom: 255, moods: ["nature", "beach", "culture"], featured: null },
  { key: "kerala", image: "world-kerala", clip: null, nights: 8, days: 9, priceFrom: 260, moods: ["nature"], featured: null },
  { key: "czechAustria", image: "world-czech-austria", clip: null, nights: 7, days: 8, priceFrom: 389, moods: ["city", "culture"], featured: null },
  { key: "scandinavia", image: "world-scandinavia", clip: null, nights: 11, days: 12, priceFrom: 1295, moods: ["nature", "city"], featured: null },
  { key: "qatar", image: "world-qatar", clip: null, nights: 3, days: 4, priceFrom: 199, moods: ["city"], featured: null },
  { key: "armenia", image: "world-armenia", clip: null, nights: 4, days: 5, priceFrom: 159, moods: ["culture", "nature"], featured: null },
  { key: "taiwan", image: null, clip: null, nights: 4, days: 5, priceFrom: 150, moods: ["city"], featured: null },
  { key: "indonesia", image: null, clip: null, nights: 8, days: 9, priceFrom: 240, moods: ["nature", "city"], featured: null },
];

export const worldKeys = world.map((w) => w.key);

// Packages with a photograph, featured ones first.
export const worldWithPhotos = () =>
  world
    .filter((w) => w.image !== null)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99) || a.priceFrom - b.priceFrom);

export const worldWithoutPhotos = () => world.filter((w) => w.image === null);
