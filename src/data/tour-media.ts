// Optional motion and people imagery per tour, keyed by slug. Kept apart from
// tours.ts so the catalog data stays purely factual. A missing entry simply
// means the photograph stands alone.

// Clip keys map to scripts/videos.manifest.mjs and src/data/videos.generated.ts.
export const tourClips: Partial<Record<string, string>> = {
  "muscat-moments": "clip-muscat",
  "jabal-akhdar-day-tour": "clip-jabal-akhdar",
  "glimpse-oman": "clip-wahiba",
  "great-fort-tour": "clip-nizwa",
  "coastal-road-tour": "clip-wadi-shab",
  "jebel-shams-grand-canyon": "clip-jebel-shams",
};

// People photos (image keys from images.generated.ts) shown as polaroid insets.
export const tourPeople: Partial<Record<string, string>> = {
  "muscat-moments": "people-mosque-visit",
  "jabal-akhdar-day-tour": "people-mountain-couple",
  "glimpse-oman": "people-desert-family",
  "great-fort-tour": "people-fort-family",
  "coastal-road-tour": "people-wadi-kids",
  "jebel-shams-grand-canyon": "people-mountain-couple",
};
